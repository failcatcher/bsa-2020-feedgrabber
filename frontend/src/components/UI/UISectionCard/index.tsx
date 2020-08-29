import React, {FC, useState} from "react";
import styles from "./styles.module.sass";
import { ISection } from "models/forms/Sections/types";

export interface IUISectionProps {
    section: ISection;
    onChanged(id: string, title: string, description: string): void;
}

const UISection: FC<IUISectionProps> = ({section, onChanged}) => {
    const [title, setTitle] = useState(section.title);
    const [description, setDescription] = useState(section.description);

    return (
        <div className={styles.headerContainer}>
                <div className={["ui very padded segment", styles.sectionCard].join(' ')}>
                    <input type="text" className={styles.title} 
                    value={title}
                    placeholder="Title"
                    onChange={e => setTitle(e.target.value)}
                    onBlur={e => {
                        onChanged(section.id, title, description);}}/>
                    <input type="text" className={styles.description} 
                    value={description}
                    placeholder="Description"
                    onChange={e => setDescription(e.target.value)}
                    onBlur={e => {
                        onChanged(section.id, title, description);}}/>
                </div>
        </div>
        );
};

export default UISection;