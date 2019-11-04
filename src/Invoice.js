import React from 'react';
import { Layout, Input, Row, Col, Divider, Select, Typography, DatePicker, Table, Icon, Button, InputNumber, Form } from 'antd';
import moment from 'moment';
import ReactDragListView from 'react-drag-listview';
import QueueAnim from 'rc-queue-anim';
import { connect } from "react-redux";
import { addNewTaskRow, addNewItemRow, taskAction, itemAction, deleteTaskRow, deleteItemRow, dragTaskRow, dragItemRow, applyDiscount, applyCurrency, addBuildName, addSenderName, addCurDate, addDueDate, addInvoiceNum, addTerms, addNotes, addInvoiceTitle, invoiceReset } from './actions/invoiceActions';

import './Invoice.scss';
import "antd/dist/antd.css";

const AnimationWrapper = ({ ...props }) => <QueueAnim type={['bottom', 'top']} leaveReverse component="tbody" {...props} />;

const Invoice = (props) => {

  const { state, form } = props;
  const { Text, Title } = Typography;
  const { TextArea } = Input;
  const dateFormat = 'LL';
  const { Option } = Select;
  const { Footer } = Layout;
  const { getFieldDecorator } = form;

  const taskColumns = [
    {
      title: "Task",
      dataIndex: "task",
      key: 'task',
      render: (text, record, index) => (
        <>
          <Input
            defaultValue={state.tasks[index].details.title}
            placeholder="Title"
            style={{ marginBottom: '0.625rem' }}
            onChange={value => handleTask(value, record.key, index,
              'title')}
          />
          <Input
            defaultValue={state.tasks[index].details.desc}
            placeholder="Description"
            onChange={value => handleTask(value, record.key, index,
              'desc')}
          />
        </>
      )
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: 'rate',
      render: (text, record, index) => (
        <InputNumber
          defaultValue={state.tasks[index].rate}
          formatter={value => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onChange={value => handleTask(value, record.key, index,
            'rate')}
        />
      )
    },
    {
      title: "Hours",
      dataIndex: "hours",
      key: 'hours',
      render: (text, record, index) => (
        <InputNumber
          defaultValue={state.tasks[index].hours}
          formatter={value => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onChange={value => handleTask(value, record.key, index,
            'hours')}
        />
      )
    },
    {
      title: "Total",
      dataIndex: "total",
      key: 'total',
      render: (text) => (
        <strong>{`${state.currency}${Number(text).toFixed(2)}`}</strong>
      )
    },
    {
      title: "",
      dataIndex: "operate",
      key: "operate",
      render: (text, record) =>
        <Icon onClick={() => handleDeleteTaskRow(record.key)} type="delete" />
    }
  ];

  const itemColumns = [
    {
      title: "Item",
      dataIndex: "item",
      key: 'item',
      render: (text, record, index) => (
        <>
          <Input
            defaultValue={state.items[index].details.title}
            placeholder="Title"
            style={{ marginBottom: '0.625rem' }}
            onChange={value => handleItem(value, record.key, index,
              'title')}
          />
          <Input
            defaultValue={state.items[index].details.desc}
            placeholder="Description"
            onChange={value => handleItem(value, record.key, index,
              'desc')}
          />
        </>
      )
    },
    {
      title: "Price",
      dataIndex: "price",
      key: 'price',
      render: (text, record, index) => (
        <InputNumber
          defaultValue={state.items[index].price}
          formatter={value => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onChange={value => handleItem(value, record.key, index,
            'price')}
        />
      )
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: 'qty',
      render: (text, record, index) => (
        <InputNumber
          defaultValue={state.items[index].qty}
          formatter={value => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onChange={value => handleItem(value, record.key, index,
            'qty')}
        />
      )
    },
    {
      title: "Total",
      dataIndex: "total",
      key: 'total',
      render: (text) => (
        <strong>{`${state.currency}${Number(text).toFixed(2)}`}</strong>
      )
    },
    {
      title: "",
      dataIndex: "operate",
      key: "operate",
      render: (text, record) =>
        <Icon onClick={() => handleDeleteItemRow(record.key)} type="delete" />
    }
  ];

  const taskDragProps = {
    onDragEnd(fromIndex, toIndex) {
      const data = state.tasks;
      const item = data.splice(fromIndex, 1)[0];
      data.splice(toIndex, 0, item);
      props.dragTaskRow(data)
    },
    handleSelector: "tr"
  };

  const itemDragProps = {
    onDragEnd(fromIndex, toIndex) {
      const data = state.items;
      const item = data.splice(fromIndex, 1)[0];
      data.splice(toIndex, 0, item);
      props.dragItemRow(data)
    },
    handleSelector: "tr"
  };

  const handleTask = (value, key, index, type) => props.taskAction(value, key, index, type);
  const handleItem = (value, key, index, type) => props.itemAction(value, key, index, type);
  const handleAddNewTask = () => props.addNewTaskRow();
  const handleAddNewItem = () => props.addNewItemRow();
  const handleDeleteTaskRow = (key) => props.deleteTaskRow(key);
  const handleDeleteItemRow = (key) => props.deleteItemRow(key);
  const handleDiscount = (evt) => props.applyDiscount(evt);
  const handleCountryCurrency = (curreny) => props.applyCurrency(curreny);
  const showTotalPrice = () => {
    const totalPriceRes = state.discountValue !== '0' ? (Number(state.totalPrice) - Number(state.discountValue)).toFixed(2) : Number(state.totalPrice).toFixed(2);
    return `${state.currency}${totalPriceRes}`;
  }
  const handleBuildName = (evt) => props.addBuildName(evt);
  const handleSenderName = (evt) => props.addSenderName(evt);
  const handleCurDate = (dateString) => props.addCurDate(dateString);
  const handleDueDate = (dateString) => props.addDueDate(dateString);
  const handleInvoiceNum = (evt) => props.addInvoiceNum(evt);
  const handleTerms = (evt) => props.addTerms(evt);
  const handleNotes = (evt) => props.addNotes(evt);
  const handleInvoiceTitle = (evt) => props.addInvoiceTitle(evt);
  const handleSubmit = evt => {
    evt.preventDefault();
    props.form.validateFields((err) => {
      if (!err) {
        props.history.push("/preview");
      }
    });
  };
  const handleReset = () => {
    props.invoiceReset();
  }

  return (
    <Layout>
      <Row>
        <Form onSubmit={handleSubmit}>
          <Col span={14} offset={5}>

            <div className="invoice-page">

              <Row type="flex" justify='space-between' align="middle" style={{ marginBottom: '4rem' }}>
                <Col span={12}>
                  <Title level={3}><Icon type="file-text" /> InvoiceGen</Title>
                </Col>
                <Col style={{ textAlign: 'right' }} span={12}>
                  <Button htmlType='submit' style={{ marginRight: '0.5rem' }} size='large' icon='eye' type="primary">Preview</Button>
                  <Button onClick={(evt) => handleReset(evt)} size='large' icon='undo' type="danger">Reset</Button>
                </Col>
              </Row>

              <Row style={{ marginBottom: '2rem' }} type="flex" justify='space-between'>
                <Col span={10}>
                  <Form.Item>
                    {getFieldDecorator('buildname', {
                      initialValue: `${state.buildName}`,
                      rules: [{ required: true, message: "Customer can't be blank" }],
                    })(
                      <Input onChange={(evt) => handleBuildName(evt)} addonBefore="Buil to" placeholder="Customer" />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item>
                    {getFieldDecorator('sendername', {
                      initialValue: `${state.senderName}`,
                      rules: [{ required: true, message: "Sender can't be blank" }],
                    })(
                      <Input onChange={(evt) => handleSenderName(evt)} addonBefore="Sender Name" placeholder="Invoice Sender" />,
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ marginBottom: '2rem' }} />

              <Row style={{ marginBottom: '3rem' }} type="flex" justify='space-between'>
                <Col span={12}>
                  <Form.Item>
                    <Input onChange={(evt) => handleInvoiceTitle(evt)} size="large" placeholder="Title (Optional)" style={{ marginBottom: '0.625rem' }} value={state.invoiceTitle} />
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('invoicenumber', {
                      initialValue: `${state.invoiceNum}`,
                      rules: [{ required: true, message: "Invoice Number can't be blank" }],
                    })(
                      <Input onChange={(evt) => handleInvoiceNum(evt)} addonBefore="Invoice Number" />,
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('currentdate', {
                      initialValue: state.currentDate === '' ? null : moment(state.currentDate, dateFormat),
                      rules: [{ type: 'object', required: true, message: "Invoice Date can't be blank" }],
                    })(
                      <DatePicker onChange={(date, dateString) => handleCurDate(dateString)} format={dateFormat} placeholder={'Invoice date'} style={{ width: '50%' }} />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Col span={12}>
                    <Form.Item>
                      <Select
                        showSearch
                        style={{ width: '100%' }}
                        defaultValue={state.currency}
                        optionFilterProp="children"
                        onChange={(currenyValue) => handleCountryCurrency(currenyValue)}
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value='$'>USD</Option>
                        <Option value='CA$'>CAD</Option>
                        <Option value='€'>EUR</Option>
                        <Option value='AED'>AED</Option>
                        <Option value='Af'>AFN</Option>
                        <Option value='ALL'>ALL</Option>
                        <Option value='AMD'>AMD</Option>
                        <Option value='AR$'>ARS</Option>
                        <Option value='AU$'>AUD</Option>
                        <Option value='man.'>AZN</Option>
                        <Option value='KM'>BAM</Option>
                        <Option value='Tk'>BDT</Option>
                        <Option value='BGN'>BGN</Option>
                        <Option value='BD'>BHD</Option>
                        <Option value='FBu'>BIF</Option>
                        <Option value='BN$'>BND</Option>
                        <Option value='Bs'>BOB</Option>
                        <Option value='R$'>BRL</Option>
                        <Option value='BWP'>BWP</Option>
                        <Option value='BYR'>BYR</Option>
                        <Option value='BZ$'>BZD</Option>
                        <Option value='CDF'>CDF</Option>
                        <Option value='CHF'>CHF</Option>
                        <Option value='CL$'>CLP</Option>
                        <Option value='CN¥'>CNY</Option>
                        <Option value='CO$'>COP</Option>
                        <Option value='₡'>CRC</Option>
                        <Option value='CV$'>CVE</Option>
                        <Option value='Kč'>CZK</Option>
                        <Option value='Fdj'>DJF</Option>
                        <Option value='Dkr'>DKK</Option>
                        <Option value='RD$'>DOP</Option>
                        <Option value='DA'>DZD</Option>
                        <Option value='Ekr'>EEK</Option>
                        <Option value='EGP'>EGP</Option>
                        <Option value='Nfk'>ERN</Option>
                        <Option value='Br'>ETB</Option>
                        <Option value='£'>GBP</Option>
                        <Option value='GEL'>GEL</Option>
                        <Option value='GH₵'>GHS</Option>
                        <Option value='FG'>GNF</Option>
                        <Option value='GTQ'>GTQ</Option>
                        <Option value='HK$'>HKD</Option>
                        <Option value='HNL'>HNL</Option>
                        <Option value='kn'>HRK</Option>
                        <Option value='Ft'>HUF</Option>
                        <Option value='Rp'>IDR</Option>
                        <Option value='₪'>ILS</Option>
                        <Option value='Rs'>INR</Option>
                        <Option value='IQD'>IQD</Option>
                        <Option value='IRR'>IRR</Option>
                        <Option value='Ikr'>ISK</Option>
                        <Option value='J$'>JMD</Option>
                        <Option value='JD'>JOD</Option>
                        <Option value='¥'>JPY</Option>
                        <Option value='Ksh'>KES</Option>
                        <Option value='KHR'>KHR</Option>
                        <Option value='CF'>KMF</Option>
                        <Option value='₩'>KRW</Option>
                        <Option value='KD'>KWD</Option>
                        <Option value='KZT'>KZT</Option>
                        <Option value='LB£'>LBP</Option>
                        <Option value='SLRs'>LKR</Option>
                        <Option value='Lt'>LTL</Option>
                        <Option value='Ls'>LVL</Option>
                        <Option value='LD'>LYD</Option>
                        <Option value='MAD'>MAD</Option>
                        <Option value='MDL'>MDL</Option>
                        <Option value='MGA'>MGA</Option>
                        <Option value='MKD'>MKD</Option>
                        <Option value='MMK'>MMK</Option>
                        <Option value='MOP$'>MOP</Option>
                        <Option value='MURs'>MUR</Option>
                        <Option value='MX$'>MXN</Option>
                        <Option value='RM'>MYR</Option>
                        <Option value='MTn'>MZN</Option>
                        <Option value='N$'>NAD</Option>
                        <Option value='₦'>NGN</Option>
                        <Option value='C$'>NIO</Option>
                        <Option value='Nkr'>NOK</Option>
                        <Option value='NPRs'>NPR</Option>
                        <Option value='NZ$'>NZD</Option>
                        <Option value='OMR'>OMR</Option>
                        <Option value='B/.'>PAB</Option>
                        <Option value='S/.'>PEN</Option>
                        <Option value='₱'>PHP</Option>
                        <Option value='PKRs'>PKR</Option>
                        <Option value='zł'>PLN</Option>
                        <Option value='₲'>PYG</Option>
                        <Option value='QR'>QAR</Option>
                        <Option value='RON'>RON</Option>
                        <Option value='din.'>RSD</Option>
                        <Option value='RUB'>RUB</Option>
                        <Option value='RWF'>RWF</Option>
                        <Option value='SR'>SAR</Option>
                        <Option value='SDG'>SDG</Option>
                        <Option value='Skr'>SEK</Option>
                        <Option value='S$'>SGD</Option>
                        <Option value='Ssh'>SOS</Option>
                        <Option value='SY£'>SYP</Option>
                        <Option value='฿'>THB</Option>
                        <Option value='DT'>TND</Option>
                        <Option value='T$'>TOP</Option>
                        <Option value='TL'>TRY</Option>
                        <Option value='TT$'>TTD</Option>
                        <Option value='NT$'>TWD</Option>
                        <Option value='TSh'>TZS</Option>
                        <Option value='₴'>UAH</Option>
                        <Option value='USh'>UGX</Option>
                        <Option value='$U'>UYU</Option>
                        <Option value='UZS'>UZS</Option>
                        <Option value='Bs.F.'>VEF</Option>
                        <Option value='₫'>VND</Option>
                        <Option value='FCFA'>XAF</Option>
                        <Option value='CFA'>XOF</Option>
                        <Option value='YR'>YER</Option>
                        <Option value='R'>ZAR</Option>
                        <Option value='ZK'>ZMK</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col style={{ textAlign: 'right' }} span={12}>
                    <Title level={3}>{showTotalPrice()}</Title>
                  </Col>
                  <Col span={24}>
                    <Form.Item>
                      <DatePicker
                        onChange={(date, dateString) => handleDueDate(dateString)}
                        placeholder={'Due date'}
                        defaultValue={state.dueDate !== '' ? moment(`${state.dueDate}`, dateFormat) : null}
                        format={dateFormat}
                        style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Col>
              </Row>

              <div style={{ marginBottom: '4rem' }}>
                <ReactDragListView {...taskDragProps}>
                  <Table
                    style={{ marginBottom: '1rem' }}
                    columns={taskColumns}
                    pagination={false}
                    dataSource={state.tasks}
                    components={{
                      body: {
                        wrapper: AnimationWrapper
                      }
                    }}
                  />
                </ReactDragListView>
                <Button onClick={handleAddNewTask} type="primary" icon="plus">Task</Button>
              </div>


              <div style={{ marginBottom: '4rem' }}>
                <ReactDragListView {...itemDragProps}>
                  <Table
                    style={{ marginBottom: '1rem' }}
                    columns={itemColumns}
                    pagination={false}
                    dataSource={state.items}
                    components={{
                      body: {
                        wrapper: AnimationWrapper
                      }
                    }}
                  />
                </ReactDragListView>
                <Button onClick={handleAddNewItem} type="primary" icon="plus">Item</Button>
              </div>

              <Row type="flex" justify='space-between'>

                <Col className="gutter-row" span={10}>
                  <Form.Item>
                    <TextArea
                      style={{ marginBottom: '0.625rem' }}
                      defaultValue={state.terms}
                      placeholder="Terms"
                      autosize={{ minRows: 2, maxRows: 3 }}
                      onChange={(evt) => handleTerms(evt)}
                    />
                  </Form.Item>
                  <Form.Item>
                    <TextArea
                      placeholder="Notes"
                      defaultValue={state.notes}
                      autosize={{ minRows: 2, maxRows: 3 }}
                      onChange={(evt) => handleNotes(evt)}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>

                  <Row>
                    <Col span={10}>
                      <Form.Item>
                        <Input
                          onChange={(evt) => handleDiscount(evt)}
                          addonBefore="Discount"
                          addonAfter="%"
                          defaultValue={state.discountPercent * 100} />
                      </Form.Item>
                    </Col>
                    <Col span={14} style={{ textAlign: 'right' }}>
                      <Text strong>{`${state.currency}${Number(state.discountValue).toFixed(2)}`}</Text>
                    </Col>
                  </Row>

                  <Divider />

                  <Row>
                    <Col span={12}>
                      <Text strong>Amount Due (USD):</Text>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <Text strong>{showTotalPrice()}</Text>
                    </Col>
                  </Row>

                  <Divider />

                  <Row type="flex" justify='space-between' align="middle">
                    <Col style={{ textAlign: 'right' }} span={24}>
                      <Button htmlType='submit' style={{ marginRight: '0.5rem' }} size='large' icon='eye' type="primary">Preview</Button>
                      <Button size='large' icon='undo' type="danger">Reset</Button>
                    </Col>
                  </Row>

                </Col>
              </Row>

            </div>
          </Col>
        </Form>

      </Row>

      <Footer style={{ textAlign: 'center' }}>©2019 Created by Javad</Footer>
    </Layout>
  );
};

const mapStateToPropos = (state) => {

  return {
    state
  };
};

const mapDispatchToProps = dispatch => {
  return {
    invoiceReset: () => {
      dispatch(invoiceReset())
    },
    addSenderName: (evt) => {
      dispatch(addSenderName(evt))
    },
    addCurDate: (dateString) => {
      dispatch(addCurDate(dateString))
    },
    addDueDate: (dateString) => {
      dispatch(addDueDate(dateString))
    },
    addInvoiceNum: (evt) => {
      dispatch(addInvoiceNum(evt))
    },
    addTerms: (evt) => {
      dispatch(addTerms(evt))
    },
    addNotes: (evt) => {
      dispatch(addNotes(evt))
    },
    addInvoiceTitle: (evt) => {
      dispatch(addInvoiceTitle(evt))
    },
    addBuildName: (evt) => {
      dispatch(addBuildName(evt))
    },
    applyCurrency: (currency) => {
      dispatch(applyCurrency(currency))
    },
    applyDiscount: (evt) => {
      dispatch(applyDiscount(evt))
    },
    dragTaskRow: (data) => {
      dispatch(dragTaskRow(data))
    },
    dragItemRow: (data) => {
      dispatch(dragItemRow(data))
    },
    deleteTaskRow: (key) => {
      dispatch(deleteTaskRow(key))
    },
    deleteItemRow: (key) => {
      dispatch(deleteItemRow(key))
    },
    taskAction: (value, key, index, type) => {
      dispatch(taskAction(value, key, index, type))
    },
    itemAction: (value, key, index, type) => {
      dispatch(itemAction(value, key, index, type))
    },
    addNewTaskRow: () => {
      dispatch(addNewTaskRow())
    },
    addNewItemRow: () => {
      dispatch(addNewItemRow())
    },
  };
};

const InvoiceForm = Form.create({ name: 'invoice_form' })(Invoice);

export default connect(mapStateToPropos, mapDispatchToProps)(InvoiceForm);
