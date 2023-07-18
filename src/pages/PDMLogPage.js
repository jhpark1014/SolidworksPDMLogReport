import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import PropTypes from 'prop-types';

// sections
import PDMLogChartPage from './PDMLogChartPage';
import PDMLogTablePage from './PDMLogTablePage';

PDMLogPage.propTypes = {
  logType: PropTypes.string,
  logName: PropTypes.string,
};

export default function PDMLogPage({ logType, logName }) {
  const [searchType, setSearchType] = useState(''); // 검색 구분
  const [searchDate, setSearchDate] = useState(''); // 검색 날짜
  const [searchUser, setSearchUser] = useState(''); // 검색 사용자
  const [logDatas, setLogDatas] = useState([]); // server 처리 결과
  const [tableHead, setTableHead] = useState([]); // 테이블 칼럼

  console.log('searchDatepage', searchDate);
  // console.log('table', tableHead);

  return (
    <>
      <Helmet>
        <title>{logName}</title>
      </Helmet>

      <PDMLogChartPage
        title={logName}
        subTitle={`${searchType === 'month' ? '월' : '연'}, ${searchDate}, ${searchUser}`}
        xLabel={`${searchType === 'month' ? '일' : '월'}`}
        chartDatas={logDatas}
        chartLabels={tableHead}
      />
      <br />
      <PDMLogTablePage
        sParam={logType}
        onSearchType={setSearchType}
        onSearchDate={setSearchDate}
        onSearchUser={setSearchUser}
        onLogDatas={setLogDatas}
        onTableHead={setTableHead}
      />
    </>
  );
}
