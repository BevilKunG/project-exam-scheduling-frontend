import {DateTime} from 'luxon'

const dates = [
  '2021-08-09',
  '2021-08-10',
  '2021-08-11',
  '2021-08-12',
  '2021-08-13',
]

const times = (() => {
  const ts = []
  let t = DateTime.fromObject({hour: 9, minute: 0})
  const e = DateTime.fromObject({hour: 17, minute: 0})
  while (t <= e) {
    ts.push(t.toLocaleString(DateTime.TIME_24_SIMPLE))
    t = t.plus({minutes: 15})
  }
  return ts
})()

const projects = getProjects()

const columns = generateColumns(dates, times, projects)

const mockData: any = {
  dates,
  times,
  projects,
  columns,
}

export default mockData

// function generateProjects() {
//   const raw = fs.readFileSync('./project_info_2564_1.csv', 'utf-8')
//   const data: any = raw.split(/\r?\n/).slice(1)
//   const projects: any = {}
//   for(const [k, v] of data.entries()) {
//     const line = v.split(',')
//     const id = `project-${k}`
//     projects[id] = {
//       id,
//       title: line[3],
//       subject: line[1],
//       committees: line[2].split(' '),
//       students: line[0].split(' ')
//     }
//   }
//   return projects
// }

function generateColumns(dates: string[], times: string[], projects: any) {
  const columns: any = {
    'column-0': {
      id: 'column-0',
      projectIds: Object.keys(projects),
    },
  }

  for (const date of dates) {
    for (const time of times) {
      const id = `column-${date}-${time}`
      columns[id] = {
        id,
        projectIds: [],
      }
    }
  }

  return columns
}

function getProjects() {
  return {
    'project-0': {
      id: 'project-0',
      title: 'Property Rental Service : Dobaan CNX',
      subject: 'ISNE492',
      students: ['580611064'],
      committees: ['dome', 'navadon', 'lachana'],
    },
    'project-1': {
      id: 'project-1',
      title:
        'Physical Activity Data Collection System from Child Therapeutic Activity for Assisting Measurement of Child Development',
      subject: 'CPE492',
      students: ['590612140'],
      committees: ['roger', 'anya', 'narathip'],
    },
    'project-2': {
      id: 'project-2',
      title: 'Robot War',
      subject: 'CPE492',
      students: ['600610731'],
      committees: ['narathip', 'karn', 'sakgasit'],
    },
    'project-3': {
      id: 'project-3',
      title: 'Gacha simulator',
      subject: 'CPE491',
      students: ['600610771'],
      committees: ['lachana', 'sakgasit', 'karn'],
    },
    'project-4': {
      id: 'project-4',
      title: 'Inventory system',
      subject: 'CPE492',
      students: ['600610793'],
      committees: ['sansanee', 'dome', 'lachana'],
    },
    'project-5': {
      id: 'project-5',
      title: 'Logixtik',
      subject: 'ISNE492',
      students: ['600611043'],
      committees: ['ken', 'pruet', 'santi'],
    },
    'project-6': {
      id: 'project-6',
      title: 'Repairer: Application to help find repair services',
      subject: 'CPE491',
      students: ['600612149', '600612158'],
      committees: ['navadon', 'roger', 'dome'],
    },
    'project-7': {
      id: 'project-7',
      title: 'IMSteel: Inventory Management System for Steel Grating Factory',
      subject: 'CPE492',
      students: ['600612155'],
      committees: ['dome', 'trasapong', 'lachana'],
    },
    'project-8': {
      id: 'project-8',
      title: 'Van and Driver Transport Platform',
      subject: 'CPE492',
      students: ['600612164'],
      committees: ['dome', 'navadon', 'trasapong'],
    },
    'project-9': {
      id: 'project-9',
      title:
        'Mobile Application for Earthquake Warining Using Earthquake Monitoring Virtual Networks',
      subject: 'CPE491',
      students: ['600612171', '600612153'],
      committees: ['paskorn', 'natthanan', 'kampol'],
    },
    'project-10': {
      id: 'project-10',
      title: 'My Virtual Fitting Room',
      subject: 'CPE491',
      students: ['610610568'],
      committees: ['santi', 'karn', 'anya'],
    },
    'project-11': {
      id: 'project-11',
      title: 'Stock Price Prediction using Machine Learning Algorithms',
      subject: 'CPE491',
      students: ['610610569'],
      committees: ['patiwet', 'karn', 'sansanee'],
    },
    'project-12': {
      id: 'project-12',
      title: 'Detecting Depression in Social Media Text with Machine Learning',
      subject: 'CPE491',
      students: ['610610571', '610610615'],
      committees: ['kasemsit', 'navadon', 'karn'],
    },
    'project-13': {
      id: 'project-13',
      title: 'Amateur Gardening application',
      subject: 'CPE491',
      students: ['610610574', '610610699'],
      committees: ['narissara', 'lachana', 'sakgasit'],
    },
    'project-14': {
      id: 'project-14',
      title: 'Smash On League',
      subject: 'CPE491',
      students: ['610610576', '610610575'],
      committees: ['narathip', 'karn', 'sakgasit'],
    },
    'project-15': {
      id: 'project-15',
      title: 'Interference Suppression in Internet of Things (IoT) System',
      subject: 'CPE491',
      students: ['610610582', '610610703'],
      committees: ['natthanan', 'yuthapong', 'kampol'],
    },
    'project-16': {
      id: 'project-16',
      title: 'Pidery: Pizza Delivery Game',
      subject: 'CPE491',
      students: ['610610585'],
      committees: ['karn', 'narathip', 'sakgasit'],
    },
    'project-17': {
      id: 'project-17',
      title:
        'Fine-grained complexity of dynamic programming problems in directed acyclic graphs',
      subject: 'CPE491',
      students: ['610610587'],
      committees: ['chinawat', 'sanpawat', 'pruet'],
    },
    'project-18': {
      id: 'project-18',
      title: 'Performance improvement of a block-cipher operation',
      subject: 'CPE491',
      students: ['610610588'],
      committees: ['chinawat', 'pruet', 'sanpawat'],
    },
    'project-19': {
      id: 'project-19',
      title: 'Automatic COVID-19 Detection using Machine Learning',
      subject: 'CPE491',
      students: ['610610589'],
      committees: ['kasemsit', 'sansanee', 'karn'],
    },
    'project-20': {
      id: 'project-20',
      title: 'Stock Trading Recommendation System',
      subject: 'CPE491',
      students: ['610610591'],
      committees: ['patiwet', 'dome', 'kasemsit'],
    },
    'project-21': {
      id: 'project-21',
      title: 'Online Thai Video Content Search System',
      subject: 'CPE491',
      students: ['610610592', '610610573'],
      committees: ['santi', 'karn', 'chinawat'],
    },
    'project-22': {
      id: 'project-22',
      title: 'Vindex : Tactical Card Game',
      subject: 'CPE491',
      students: ['610610593', '610610572'],
      committees: ['sakgasit', 'chinawat', 'narathip'],
    },
    'project-23': {
      id: 'project-23',
      title: 'central trading card game platform',
      subject: 'CPE491',
      students: ['610610594', '610610602'],
      committees: ['pruet', 'karn', 'navadon'],
    },
    'project-24': {
      id: 'project-24',
      title: 'ANIMO : Pet Clinic Management System',
      subject: 'CPE491',
      students: ['610610595', '610610611'],
      committees: ['sakgasit', 'lachana', 'narissara'],
    },
    'project-25': {
      id: 'project-25',
      title: 'Project exam scheduling algorithm',
      subject: 'CPE491',
      students: ['610610598'],
      committees: ['chinawat', 'sanpawat', 'paskorn'],
    },
    'project-26': {
      id: 'project-26',
      title: 'The Arena',
      subject: 'CPE491',
      students: ['610610599'],
      committees: ['kampol', 'sakgasit', 'narathip'],
    },
    'project-27': {
      id: 'project-27',
      title: 'Data Visualization of Urban Scooter Usage',
      subject: 'CPE491',
      students: ['610610600'],
      committees: ['santi', 'narathip', 'natthanan'],
    },
    'project-28': {
      id: 'project-28',
      title: 'Smart LIDAR System for Explosives Installation',
      subject: 'CPE491',
      students: ['610610601', '610610597'],
      committees: ['kampol', 'paskorn', 'sansanee'],
    },
    'project-29': {
      id: 'project-29',
      title: 'Application for Route Managing in SDN',
      subject: 'CPE491',
      students: ['610610603', '610610701'],
      committees: ['yuthapong', 'dome', 'natthanan'],
    },
    'project-30': {
      id: 'project-30',
      title: 'Drugstore web app',
      subject: 'CPE491',
      students: ['610610604'],
      committees: ['lachana', 'dome', 'narissara'],
    },
    'project-31': {
      id: 'project-31',
      title: 'Hospital Care Guide Platform',
      subject: 'CPE492',
      students: ['610610606', '610610580'],
      committees: ['dome', 'sansanee', 'trasapong'],
    },
    'project-32': {
      id: 'project-32',
      title: 'Elliott wave recognition in stock market',
      subject: 'CPE491',
      students: ['610610608'],
      committees: ['sansanee', 'patiwet', 'nipon'],
    },
    'project-33': {
      id: 'project-33',
      title: 'Speech Emotional Recognition',
      subject: 'CPE491',
      students: ['610610609'],
      committees: ['sansanee', 'nipon', 'kasemsit'],
    },
    'project-34': {
      id: 'project-34',
      title: 'CMU Life Reviews',
      subject: 'CPE491',
      students: ['610610612'],
      committees: ['lachana', 'sakgasit', 'kampol'],
    },
    'project-35': {
      id: 'project-35',
      title: '2D Side-Scolling Game',
      subject: 'CPE491',
      students: ['610610617', '610610577'],
      committees: ['patiwet', 'narathip', 'chinawat'],
    },
    'project-36': {
      id: 'project-36',
      title: 'Arena of Champions',
      subject: 'CPE491',
      students: ['610610619'],
      committees: ['sanpawat', 'chinawat', 'sakgasit'],
    },
    'project-37': {
      id: 'project-37',
      title: 'Story and Novel planner : Novelis',
      subject: 'CPE491',
      students: ['610610620', '610610579'],
      committees: ['dome', 'pruet', 'lachana'],
    },
    'project-38': {
      id: 'project-38',
      title: 'Visualization system for graduation requirement fulfillment',
      subject: 'CPE491',
      students: ['610610625', '610610578'],
      committees: ['chinawat', 'pruet', 'navadon'],
    },
    'project-39': {
      id: 'project-39',
      title:
        'Thermal and Electric Power visualization interoperability BIM in data center',
      subject: 'CPE492',
      students: ['610610626', '610610707'],
      committees: ['paskorn', 'natthanan', 'kampol'],
    },
    'project-40': {
      id: 'project-40',
      title: 'Crystal Royale',
      subject: 'CPE491',
      students: ['610610696', '610610697'],
      committees: ['narathip', 'karn', 'sakgasit'],
    },
    'project-41': {
      id: 'project-41',
      title: 'RFID: Anti-collision system',
      subject: 'CPE491',
      students: ['610610700', '610612019'],
      committees: ['anya', 'kampol', 'paskorn'],
    },
    'project-42': {
      id: 'project-42',
      title: 'Me-Nu: Web Application for Restaurant Menu',
      subject: 'CPE491',
      students: ['610610705', '610610623'],
      committees: ['navadon', 'pruet', 'santi'],
    },
    'project-43': {
      id: 'project-43',
      title:
        'Development of coffee shop web application using Twitter analytics',
      subject: 'CPE491',
      students: ['610612017', '610612119'],
      committees: ['natthanan', 'paskorn', 'navadon'],
    },
  }
}
