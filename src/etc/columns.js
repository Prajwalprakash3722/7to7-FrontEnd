export const masterListColumns = [
    {
        Header: 'Available models',
        columns: [
            {
                Header: '#',
                accessor: 'id',
            },
            {
                Header: 'Model Description',
                accessor: 'model_desc',
            },
            {
                Header: 'Data file',
                accessor: 'data_loc',
            },
            {
                Header: 'Prediction file',
                accessor: 'pred_loc',
            }
        ],
    },
];
