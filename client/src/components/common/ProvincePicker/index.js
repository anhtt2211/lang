import React, { useEffect, useState } from 'react';
import { Col, Form, Input, Row, Select } from 'antd';
import LocationVN from './LocationVN.json';

const ProvincePicker = props => {
  let cityOptions = [];
  const [districtInSelectedCity, setDistrictInSelectedCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState();
  const [selectedDistrict, setSelectedDistrict] = useState();

  for (let city of Object.values(LocationVN)) {
    cityOptions.push(city);
  }

  const mapDistrictToArray = districts => {
    let result = [];
    for (let district of Object.values(districts)) {
      result.push({ name: district });
    }
    return result;
  };
  useEffect(() => {
    for (let city of Object.values(LocationVN)) {
      if (city.name === selectedCity || city.name === props.city) {
        setDistrictInSelectedCity(mapDistrictToArray(city.districts));
        return true;
      }
    }
  }, [selectedCity]);

  const renderOptions = dataList => {
    if (dataList.length) {
      return dataList.map(data => {
        return (
          <Option key={data['name']} value={data['name']}>
            {data['name']}
          </Option>
        );
      });
    }
    return null;
  };
  const optionCityRendered = renderOptions(cityOptions);
  const optionDistrictRendered = renderOptions(districtInSelectedCity);
  return (
    <Row gutter={20}>
      <Col span={8}>
        <Form.Item label="Address" name="detailsAddress" rules={[{ required: true }]}>
          <Input placeholder="Address" style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="City" name="city" rules={[{ required: true }]}>
          <Select
            value={selectedCity}
            placeholder="Tỉnh/Thành phố"
            onChange={val => {
              setSelectedDistrict(null);
              setSelectedCity(val);
            }}>
            {optionCityRendered}
          </Select>
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="District" name="district" rules={[{ required: true }]}>
          <Select
            value={selectedDistrict}
            placeholder="Huyện/Quận"
            onChange={val => {
              setSelectedDistrict(val);
            }}>
            {optionDistrictRendered}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default ProvincePicker;
