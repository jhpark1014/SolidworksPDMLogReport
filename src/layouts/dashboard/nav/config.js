// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------
const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;
const navConfig = [
  {
    title: '다운로드 로그',
    path: '/dashboard/download',    
    icon:  icon('ic_pdm_d'),    
  },
  {
    title: '신규등록 로그',
    path: '/dashboard/newcreate',
    icon: icon('ic_pdm_n'),
  },
  {
    title: '버전업 로그',
    path: '/dashboard/versionup',
    icon: icon('ic_pdm_v'),
  },
  {
    title: '설계변경 로그',
    path: '/dashboard/engchange',
    icon: icon('ic_pdm_e'),
  },
  {
    title: '라이선스 로그',
    path: '/dashboard/licenselog',
    icon: icon('ic_lic'),
  },
  {
    title: '라이선스 로그(사용자)',
    path: '/dashboard/userlog',
    icon: icon('ic_lic_user'),
  },  
];

export default navConfig;
