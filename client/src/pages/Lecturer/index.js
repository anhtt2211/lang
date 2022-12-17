import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Input, Modal, notification, Table, Tag } from 'antd';
import moment from 'moment';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import * as lecturerActions from 'redux/actions/lecturers';
import { lecturerState$ } from 'redux/selectors';
import styles from './index.module.less';
import { CSVLink } from 'react-csv';
import ExportCSV from 'components/common/ExportCSV';
import { lecturerHeadersExcel } from 'constant/headersExcel';

const { confirm } = Modal;
const { Search } = Input;

const mapToDataSource = array => {
  return array.map(item => {
    return {
      key: item.idLecturer,
      idLecturer: item.idLecturer,
      idUser: item.idUser,
      username: item.User.username === null ? 'null' : item.User.username,
      displayName: item.User.displayName,
      email: item.User.email,
      gender: item.User.gender === 0 ? 'Male' : item.User.gender === 1 ? 'Female' : 'Others',
      phoneNumber: item.User.phoneNumber,
      address: `${item.User.address[0]}, ${item.User.address[1]}, ${item.User.address[2]}`,
      birthday: moment(item.User.dob).format('DD/MM/YYYY'),
      isActivated: item.User.isActivated,
      isDeleted: item.isDeleted,
    };
  });
};

const Lecturer = () => {
  const [dataSource, setDataSource] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const lecturers = useSelector(lecturerState$);
  const columns = [
    {
      title: 'Full name',
      dataIndex: 'displayName',
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ellipsis: true,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      align: 'center',
      filters: [
        { text: 'Male', value: 'Male' },
        { text: 'Female', value: 'Female' },
        { text: 'Others', value: 'Others' },
      ],
      filterSearch: true,
      onFilter: (value, record) => record.gender.startsWith(value),
    },
    {
      title: 'Phone number',
      dataIndex: 'phoneNumber',
      ellipsis: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      ellipsis: true,
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday',
      align: 'center',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'isActivated',
      align: 'center',
      filters: [
        { text: 'Working', value: true },
        { text: 'Unworking', value: false },
      ],
      filterSearch: true,
      onFilter: (value, record) => {
        if (record.isActivated === value) return true;
      },
      render: isActivated => (
        <span>
          {isActivated ? <Tag color="success">Working</Tag> : <Tag color="orange">Unworking</Tag>}
        </span>
      ),
    },
    {
      title: '',
      dataIndex: 'idLecturer',
      align: 'center',
      render: idLecturer => (
        <div style={{ display: 'flex', justifyContent: 'center', columnGap: '20px' }}>
          <Button
            onClick={() => handleEditLecturer(idLecturer)}
            type="primary"
            ghost
            icon={<EditOutlined />}
          />
          <Button
            onClick={() => handleDeleteLecturer(idLecturer)}
            danger
            icon={<DeleteOutlined />}
          />
        </div>
      ),
    },
  ];

  React.useEffect(() => {
    dispatch(lecturerActions.getLecturers.getLecturersRequest());
  }, [dispatch]);
  React.useEffect(() => {
    const mapLecturersToData = mapToDataSource(lecturers.data);
    setDataSource(mapLecturersToData);
    setFilteredData(mapLecturersToData);
  }, [lecturers]);

  const handleAddLecturerClick = () => {
    history.push('/lecturer/add');
  };
  const handleEditLecturer = idLecturer => {
    history.push(`/lecturer/edit/${idLecturer}`);
  };
  const handleDeleteLecturer = idLecturer => {
    confirm({
      title: 'Do you want to delete this lecturer?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk() {
        const lecturer = lecturers.data.find(lecturer => lecturer.idLecturer === idLecturer);
        console.log({ lecturer });
        dispatch(lecturerActions.deleteLecturer.deleteLecturerRequest(lecturer));
      },
      onCancel() {},
    });
  };
  const handleSearch = value => {
    const dataSearch = dataSource.filter(
      item => item.displayName.toLowerCase().search(value.toLowerCase()) >= 0
    );
    setFilteredData(dataSearch);
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="">Application Center</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="">Application List</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <h3 className="heading">Lecturer list</h3>
      <Card>
        <div className={styles.wrapper}>
          <div>
            <Search
              className={styles.search}
              size="large"
              placeholder="Search"
              allowClear
              enterButton
              onSearch={handleSearch}
            />
          </div>
          <div>
            <Button
              style={{ marginRight: '20px' }}
              onClick={handleAddLecturerClick}
              className={styles.btn}
              size="large"
              type="primary">
              Add lecturer
            </Button>
            <Button className={styles.btn} size="large" type="primary">
              <ExportCSV data={lecturers.data} headers={lecturerHeadersExcel} type="lecturer" />
            </Button>
          </div>
        </div>
        <Table
          bordered={true}
          loading={lecturers.isLoading}
          columns={columns}
          dataSource={filteredData}
          rowKey={row => row.idLecturer}
        />
      </Card>
    </>
  );
};

export default Lecturer;
