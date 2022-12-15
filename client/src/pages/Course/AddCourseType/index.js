import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { Button, Col, Form, Input, Row, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { courseTypeState$ } from 'redux/selectors';
import { createCourseType, updateCourseType } from 'redux/actions/courseTypes';
import { validateMessages } from 'constant/validationMessage';

const { TextArea } = Input;

const AddCourseType = ({ trigger }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { data: courseTypes, isSuccess } = useSelector(courseTypeState$);
  const { idCourseType } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (idCourseType) {
      setIsEdit(true);
      const courseType = courseTypes.find(courseType => courseType.idCourseType === idCourseType);
      form.setFieldsValue({
        typeName: courseType.typeName,
        description: courseType.description,
      });
    }
  }, [idCourseType, trigger]);

  const handleSubmit = () => {
    const { typeName, description } = form.getFieldValue();
    if (typeName) {
      if (isEdit) {
        dispatch(
          updateCourseType.updateCourseTypeRequest({
            idCourseType: idCourseType,
            typeName: typeName,
            description: description,
          })
        );
        if (isSuccess) {
          message.success({
            content: 'Updated successfully',
          });
          history.push('/coursetype/');
        } else {
          message.error({
            content: 'This is an error',
          });
        }
      } else {
        dispatch(
          createCourseType.createCourseTypeRequest({
            typeName: typeName,
            description: description,
          })
        );
        isSuccess
          ? message.success({
              content: 'Add course successfully',
            })
          : message.error({
              content: 'This is an error',
            });
        form.resetFields();
      }
    }
  };
  return (
    <>
      <h3>Add course type</h3>
      <Form form={form} layout="vertical" validateMessages={validateMessages}>
        <Row gutter={[0, 0]}>
          <Col span={24}>
            <Form.Item label="Coure type name" name="typeName" rules={[{ required: true }]}>
              <Input placeholder="Coure type name" maxLength="255" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Description" name="description">
              <TextArea
                allowClear
                maxLength="255"
                placeholder="Description about the course type"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Button
                htmlType="submit"
                onClick={handleSubmit}
                style={{ width: '100%' }}
                type="primary"
                size="large">
                {isEdit ? 'Update' : 'Add'}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AddCourseType;
