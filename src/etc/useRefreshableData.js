import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import api_link from './api';

/**
 * An hook to
 * @template T
 * @param {string} dataLocation
 * @param {T} initData
 * @param {boolean} refreshOnStart true default
 * @param {boolean} doRefresh true default
 * @param {number} refreshInterval 1000
 */
export function useRefreshableData(
    dataLocation,
    initData,
    refreshOnStart = true,
    doRefresh = true,
    refreshInterval = 6000
) {
    const [isReady, setIsReady] = useState(false);
    const [data, setData] = useState(initData);
    const token = useMemo(() => localStorage.getItem('token'), []);
    const [timer, setTimer] = useState(undefined);

    useEffect(() => {
        mutator().catch((e) => console.log('Mutation error', e, this));
        if (doRefresh) {
            setTimer(
                setInterval(
                    () =>
                        mutator().catch((e) =>
                            console.log('Mutation error', e, this)
                        ),
                    refreshInterval
                )
            );
        }

        return () => {
            // clear up the handler at the end
            if (timer !== undefined) {
                clearInterval(timer);
            }
        };
    }, []);
    const mutator = async () => {
        return axios
            .get(dataLocation, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const { data } = res;
                setData(data);
                !isReady && setIsReady(true);
            });
    };

    return { data, mutator, setData, isReady };
}
