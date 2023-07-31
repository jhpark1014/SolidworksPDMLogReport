// component
import SvgIcon from '@mui/material/SvgIcon';
import DownloadIcon from '@mui/icons-material/Download';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import UpdateIcon from '@mui/icons-material/Update';
import VerifiedIcon from '@mui/icons-material/Verified';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;
// const svgIcon = (name) => <SvgIcon>{name}</SvgIcon>;

const navConfig = [  
  {
    title: '다운로드 로그',
    path: '/dashboard/download',
    icon: <DownloadIcon />,
  },
  {
    title: '신규등록 로그',
    path: '/dashboard/newcreate',
    icon: <HowToRegIcon />,
  },
  {
    title: '버전업 로그',
    path: '/dashboard/versionup',
    icon: <UpdateIcon />,
  },
  {
    title: '설계변경 로그',
    path: '/dashboard/engchange',
    icon: <UpdateIcon />,
  },
  {
    title: '라이선스 로그',
    path: '/dashboard/licenselog',
    icon: <VerifiedIcon />,
  },
  {
    title: '라이선스 로그(사용자)',
    path: '/dashboard/userlog',
    icon: icon('ic_user'),
  },
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: icon('ic_analytics'),
  // },
  // {
  //   title: 'Users',
  //   path: '/dashboard/user',
  //   icon: icon('ic_user'),
  // },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
