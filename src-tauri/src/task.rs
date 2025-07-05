use crate::{Error, Result};
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use specta::Type;
use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc, Condvar, Mutex,
};
use tauri::{ipc::Channel, AppHandle};
use tauri_specta::Event;

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
enum EventKind {
    Kill,
    Pause,
    Resume,
}

#[derive(Serialize, Deserialize, Debug, Type, Event, Clone)]
pub struct TaskEvent {
    id: u32,
    kind: EventKind,
}

#[derive(Clone, Serialize, Type)]
#[serde(tag = "event", content = "data")]
pub enum Message<T: Serialize + DeserializeOwned> {
    Started(u32),
    Progress(T),
    Finished,
}

pub struct TaskHandle<T: Serialize + DeserializeOwned> {
    id: u32,
    app: AppHandle,
    channel: Channel<Message<T>>,
    started: bool,
    finished: bool,
    killed: Arc<AtomicBool>,
    paused: Arc<(Mutex<bool>, Condvar)>,
}

impl<T: Serialize + DeserializeOwned> TaskHandle<T> {
    pub fn new(app: AppHandle, channel: Channel<Message<T>>) -> Self {
        Self {
            id: rand::random(),
            app,
            channel,
            started: false,
            finished: false,
            killed: Arc::new(AtomicBool::new(false)),
            paused: Arc::new((Mutex::new(false), Condvar::new())),
        }
    }

    pub fn start(&mut self) -> Result<()> {
        self.listen();
        self.channel.send(Message::Started(self.id))?;
        self.started = true;

        Ok(())
    }

    pub fn send(&self, data: T) -> Result<()> {
        if self.finished || self.killed.load(Ordering::Relaxed) {
            return Err(Error::TaskSendError);
        }

        let (lock, cvar) = &*self.paused;
        let mut paused = lock.lock().unwrap();

        while *paused {
            paused = cvar.wait(paused).unwrap();
        }

        self.channel.send(Message::Progress(data))?;

        Ok(())
    }

    pub fn finish(&mut self) -> Result<()> {
        self.channel.send(Message::Finished)?;
        self.finished = true;

        Ok(())
    }

    fn listen(&self) {
        let id = self.id.clone();
        let killed = self.killed.clone();
        let paused = self.paused.clone();

        TaskEvent::listen(&self.app, move |event| {
            if event.payload.id == id {
                match event.payload.kind {
                    EventKind::Kill => killed.store(true, Ordering::Relaxed),
                    EventKind::Pause => {
                        let (lock, _) = &*paused;
                        let mut paused = lock.lock().unwrap();

                        *paused = true;
                    }
                    EventKind::Resume => {
                        let (lock, cvar) = &*paused;
                        let mut paused = lock.lock().unwrap();

                        *paused = false;
                        cvar.notify_all();
                    }
                }
            }
        });
    }
}
