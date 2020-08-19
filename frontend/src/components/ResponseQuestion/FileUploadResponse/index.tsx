import React, {FC, useState} from "react";
import {Label, Tab} from "semantic-ui-react";
import styles from "./styles.module.sass";
import ImageUrl from "./ImageUrl";
import InternalStorageUpload from "./InternalStorageUpload";
import {IQuestionResponse} from "../../../models/IQuestionResponse";
import { IFileUploadQuestion } from "../../../models/forms/Questions/IQuesion";
import { fileTypes as allTypes } from "../../ComponentsQuestions/FileUploadQuestion/types";
import VideoUrl from "./UrlVideo";

const FileUploadResponse: FC<IQuestionResponse<IFileUploadQuestion>> =
    ({ question, answerHandler}) => {
    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const filesNumber = question.details.filesNumber;
    const maxFilesSize = question.details.filesSize * (1024 * 1024);
    const filesType = question.details.filesType;

    const onFilesAdded = async addedFiles => {
        setError("");
        let newFiles: any[];
        if (files.length + addedFiles.length <= filesNumber) {
            newFiles = addedFiles;
        } else {
            newFiles = addedFiles.slice(0, filesNumber - files.length);
            setError(`Maximum number of files ${filesNumber}`);
        }

        newFiles = checkFilesSize(deleteNotAllowedFiles(newFiles));

        if (filesType === allTypes.image) {
            loadImages(newFiles);
        }
        setFiles(files.concat(newFiles));

        answerHandler(question.id, { files, url });
    };

    const loadImages = async newFiles => {
        const addedImages = [];
        const promises = [];
        for (const file of newFiles) {
            promises.push(loadImage(file, addedImages));
        }
        await Promise.all(promises);
        setImages(images.concat(addedImages));
    };

    const loadImage = (file, files) => {
        if (!file.type.startsWith("image")) {
            return null;
        }

        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(files.push(reader.result));
            };

            reader.readAsDataURL(file);
        });
    };

    const checkFilesSize = checkedFiles => {
        let currentFilesSize = 0;
        for (const file of files) {
            currentFilesSize += file.size;
        }

        const result = [];
        checkedFiles.forEach(file => {
            if (currentFilesSize + file.size <= maxFilesSize) {
                result.push(file);
                currentFilesSize += file.size;
            } else {
                setError(`Maximum files size: ${question.details.filesSize} MB`);
            }
        });

        return result;
    };

     const deleteNotAllowedFiles = files => {
        const result = [];
        files.forEach(file => {
            if (file.type.startsWith(filesType)) {
                result.push(file);
            } else {
                setError(`Only ${filesType} allowed`);
            }
        });

        return result;
     };

    const mapImages = () => {
        return images.map(image => {
            return <img className="ui medium image" src={image} alt="File loaded successfully" />;
        });
    };

    const mapVideos = () => {
        return files.map(file => {
            return <Label className={styles.file}>
                {`${file.name} 
                (${Math.round(file.size / (1024 * 1024) * 100) / 100} MB)`}
            </Label>;
        });
    };

    const onClear = () => {
        setFiles([]);
        setImages([]);
        setError('');
        answerHandler(question.id, { files: [], url });
    };

    const getPanes = () => {
        switch(filesType) {
            case allTypes.image:
            case allTypes.video: {
                return [
                    {
                        menuItem: `Add ${filesType}s`,
                        render: () =>
                            <Tab.Pane>
                                <InternalStorageUpload
                                    onFilesAdded={onFilesAdded}
                                    disabled={files.length >= filesNumber}
                                    mapFiles={filesType === allTypes.image ? mapImages : mapVideos}
                                    onClear={onClear}
                                    error={error}
                                />
                            </Tab.Pane>
                    },
                    {
                        menuItem: `URL`,
                        render: () =>
                            <Tab.Pane>
                                {filesType === allTypes.image
                                    ? <ImageUrl url={url} onChange={setUrl} />
                                    : <VideoUrl url={url} onChange={setUrl} />
                                }
                            </Tab.Pane>
                    }
                ];
            }
            default:
                return null;
        }
    };

    return (
        <div className={styles.segment}>
            <Tab className={styles.tab} panes={getPanes()} />
        </div>
    );
};

export default FileUploadResponse;