import {useContext, useMemo} from 'react';
import {WorkerContext} from '../contexts/WorkerContext';
import {WorkerMessenger} from '../worker-messenger';

export const useWorkerActions = () => {
  const worker = useContext(WorkerContext);

  return useMemo(() => {
    if (!worker) return null;

    return new WorkerMessenger(worker);
  }, [worker]);
};
