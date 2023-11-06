import SideBar from "@components/organisms/SideBar/SideBar.tsx";
import SideBarSection from "@components/organisms/SideBarSection/SideBarSection.tsx";
import TextWithIcon from "@components/molecules/IconWithText/IconWithText.tsx";

function SideBarTemplate() {
    return (
        <>
            <SideBar title="Henactor">
                <SideBarSection title="Pinned">
                    <TextWithIcon icon="h" text="home" />
                    <TextWithIcon icon="h" text="home" />
                    <TextWithIcon icon="h" text="home" />
                </SideBarSection>
            </SideBar>
        </>
    );
}

export default SideBarTemplate;
