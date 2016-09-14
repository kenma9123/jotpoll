import KeenTracking from 'keen-tracking';
import { KEEN_PROJECTID, KEEN_WRITEKEY } from '../config';

// Configure a client instance
const client = new KeenTracking({
  projectId: KEEN_PROJECTID,
  writeKey: KEEN_WRITEKEY
});

export default client;
