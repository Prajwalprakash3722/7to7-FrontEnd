import { useMemo } from 'react';
import api_link from '../etc/api';
import { useRefreshableData } from '../etc/useRefreshableData';

export default function ManagementPage() {
    const token = useMemo(() => localStorage.getItem('token'), []);
    // these are custom hooks that pull in data periodically and can be forced to push data
    const {
        data: masterList,
        mutator: mutateMasterList,
        isReady: masterListIsReady,
    } = useRefreshableData(`${api_link}/api/models`, []);
    // const update
    const {
        data: modelList,
        mutator: mutateModelList,
        isReady: modelListIsReady,
    } = useRefreshableData(`${api_link}/api/files/models`, []);
    const {
        data: dataFilesList,
        mutator: mutateDataFilesList,
        isReady: dataFilesListIsReady,
    } = useRefreshableData(`${api_link}/api/files/data`, []);
    // const [modelList, setModelList] = useState([]);
    // const [dataFilesList, setDataFilesList] = useState([]);

    return (
        <div className="flex flex-col items-center justify-center mt-5">
            <div>{JSON.stringify(modelList)}</div>
            <br />
            <div>{JSON.stringify(dataFilesList)}</div>
            <br />
            <div>{JSON.stringify(masterList)}</div>
            <br />

            {/* part: Add a new entry */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log(e.inputfiles.value, e.modelfiles.value);
                }}
            >
                <label>
                    Model:
                    <select name="modelfiles" >
                        {modelListIsReady ? (
                            modelList.map((e) => (
                                <option value={e.name} key={e.name}>
                                    {e.name}
                                </option>
                            ))
                        ) : (
                            <option disabled selected>
                                Loading...
                            </option>
                        )}
                    </select>
                </label>
                <label>
                    Input Data File:
                    <select name="inputfiles">
                        {dataFilesListIsReady ? (
                            dataFilesList.map((e) => (
                                <option value={e.name} key={e.name}>
                                    {e.name}
                                </option>
                            ))
                        ) : (
                            <option disabled selected>
                                Loading...
                            </option>
                        )}
                    </select>
                </label>
            </form>
            <br />

            {/* part: Upload a  */}

            <form
                method="POST"
                action={`${api_link}/api/files`}
                onSubmit={(e) => {
                    Promise.allSettled([
                        mutateDataFilesList(),
                        mutateMasterList,
                    ]).then(e=>alert('done uploading')).catch((e) => console.log('What happened'));
                }}
                target="uploadtarget"
                encType="multipart/form-data"
            >
                <input type="file" name="misc"></input>
                <button type="submit">Submit</button>
            </form>
            <iframe title="uploadtarget" name="uploadtarget" height='0' width='0'></iframe>
        </div>
    );
}
