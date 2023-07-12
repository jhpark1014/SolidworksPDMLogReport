import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// sections
import PDMLogChartPage from './PDMLogChartPage';
import PDMLogTablePage from './PDMLogTablePage';

const TABLE_HEAD_MONTH = [
  { id: '1', label: '1일', alignRight: false },
  { id: '2', label: '2일', alignRight: false },
  { id: '3', label: '3일', alignRight: false },
  { id: '4', label: '4일', alignRight: false },
  { id: '5', label: '5일', alignRight: false },
  { id: '6', label: '6일', alignRight: false },
  { id: '7', label: '7일', alignRight: false },
  { id: '8', label: '8일', alignRight: false },
  { id: '9', label: '9일', alignRight: false },
  { id: '10', label: '10일', alignRight: false },
  { id: '11', label: '11일', alignRight: false },
  { id: '12', label: '12일', alignRight: false },
  { id: '13', label: '13일', alignRight: false },
  { id: '14', label: '14일', alignRight: false },
  { id: '15', label: '15일', alignRight: false },
  { id: '16', label: '16일', alignRight: false },
  { id: '17', label: '17일', alignRight: false },
  { id: '18', label: '18일', alignRight: false },
  { id: '19', label: '19일', alignRight: false },
  { id: '20', label: '20일', alignRight: false },
  { id: '21', label: '21일', alignRight: false },
  { id: '22', label: '22일', alignRight: false },
  { id: '23', label: '23일', alignRight: false },
  { id: '24', label: '24일', alignRight: false },
  { id: '25', label: '25일', alignRight: false },
  { id: '26', label: '26일', alignRight: false },
  { id: '27', label: '27일', alignRight: false },
  { id: '28', label: '28일', alignRight: false },
  { id: '29', label: '29일', alignRight: false },
  { id: '30', label: '30일', alignRight: false },
  { id: '31', label: '31일', alignRight: false },
];

export default function DownloadLogPage() {
  const [searchType, setSearchType] = useState(''); // 검색 구분
  const [searchDate, setSearchDate] = useState(''); // 검색 날짜
  const [searchUser, setSearchUser] = useState(''); // 검색 사용자
  const [logDatas, setLogDatas] = useState([]); // server 처리 결과
  const [tableHead, setTableHead] = useState([]); // server 처리 결과
  // const [param, setParam] = useState([]);           // server 처리 결과

  // const params = useParams();
  // console.log(params.id);

  // useEffect(() => {
  //   setParam(params.id);
  // }, [params.id]);
  console.log('downloadlogpage renderingggggggggggggg');
  console.log('table HEADDD', tableHead);

  return (
    <>
      <Helmet>
        <title>다운로드 로그</title>
      </Helmet>

      <PDMLogChartPage
        title={`다운로드 로그`}
        subTitle={`${searchType === 'month' ? '월' : '연'}, ${searchDate}, ${searchUser}`}
        xLabel={`${searchType === 'month' ? '일' : '월'}`}
        chartDatas={logDatas}
        chartLabels={tableHead}
      />
      <br />
      <PDMLogTablePage
        sParam={'download'}
        onSearchType={setSearchType}
        onSearchDate={setSearchDate}
        onSearchUser={setSearchUser}
        onLogDatas={setLogDatas}
        onTableHead={setTableHead}
      />
    </>
  );
}
