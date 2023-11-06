import { useState, useEffect } from "react";
import { Container, Title, TabsContainer } from "./WorkSpaces.styles.tsx";
import { Workspace } from "@/type.ts";
import Tab from "@components/molecules/Tab/Tab.tsx";

interface Props {
    title: string;
}

function WorkSpaces(props: Props) {
    const [tabs, setTabs] = useState(Array<Workspace>);

    useEffect(() => {
        let tabs = [{ name: "Dir", path: "/dir1" }];
        setTabs(tabs);
    }, []);

    return (
        <>
            <Container>
                <Title>{props.title}</Title>
                <TabsContainer>
                    {tabs.map((tab) => {
                        return <Tab title={tab.name} icon="X" />;
                    })}
                    <div>X</div>
                </TabsContainer>
            </Container>
        </>
    );
}

export default WorkSpaces;
