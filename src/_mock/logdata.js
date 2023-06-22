import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const logs = [...Array(24)].map(() => ({
  id: faker.datatype.uuid(),  
  name: faker.name.fullName(),
  department: faker.commerce.department(),  
  month: sample([
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ]),
}));

export default logs;
