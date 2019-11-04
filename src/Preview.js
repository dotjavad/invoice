import React from 'react';
import { connect } from "react-redux";
import { Row, Col, Divider, Typography, Icon, Button } from 'antd';
import { Link } from "react-router-dom";

import './Preview.scss';

const Preview = (props) => {

    const { state } = props;
    const { Text, Title } = Typography;

    return (

        <div className="preview-wrap">

            <div className="invoice-page">

                <Row className="no-print" type="flex" justify='space-between' align="middle" style={{ marginBottom: '4rem' }}>
                    <Col span={12}>
                        <Title level={3}><Icon type="file-text" /> InvoiceGen</Title>
                    </Col>
                    <Col style={{ textAlign: 'right' }} span={12}>
                        <Link to="/"><Button size='large' icon='arrow-left'>Go Home</Button></Link>
                        <Button style={{ marginLeft: '0.5rem' }} size='large' icon='printer' type="primary">Print</Button>
                    </Col>
                </Row>

                <Row style={{ marginBottom: '2rem' }} type="flex" justify='space-between'>
                    <Col span={10}>
                        <Text>Build To: <Text strong>{state.buildName}</Text></Text>
                    </Col>
                    <Col style={{ textAlign: 'right' }} span={10}>

                        <Text>Sender: </Text><Text strong>{state.senderName}</Text>
                    </Col>
                </Row>

                <Divider style={{ marginBottom: '2rem' }} />

                <Row style={{ marginBottom: '3rem' }} type="flex" justify='space-between'>
                    <Col span={12}>
                        <Col span={24}>
                            <Title level={3}>{state.invoiceTitle}</Title>
                        </Col>
                        <Col span={24}> <Text>Invoice #: </Text><Text strong>{state.invoiceNum}</Text></Col>
                        <Col span={24}><Text>{state.currentDate}</Text></Col>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                        <Col span={24}>
                            <Title level={4}>{state.currency}{state.totalPrice}</Title>
                        </Col>
                        <Col span={24}>
                            {
                                state.dueDate &&
                                <>
                                    <Text>Due: </Text> <Text strong>{state.dueDate}</Text>
                                </>
                            }
                        </Col>
                    </Col>
                </Row>

                {
                    state.tasks.length > 0 &&
                    <table style={{ marginBottom: '4rem', width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Rate</th>
                                <th>Hours</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.tasks.map((task, index) => (
                                <tr key={index}>
                                    <td>
                                        <Text strong>{task.details.title}</Text>
                                        <br />
                                        <Text >{task.details.desc}</Text>
                                    </td>
                                    <td><Text >{task.rate}</Text></td>
                                    <td><Text >{task.hours}</Text></td>
                                    <td><Text >{state.currency}{task.total}</Text></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }

                {
                    state.items.length > 0 &&
                    <table style={{ marginBottom: '4rem', width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <Text strong>{item.details.title}</Text>
                                        <br />
                                        <Text >{item.details.desc}</Text>
                                    </td>
                                    <td><Text >{item.price}</Text></td>
                                    <td><Text >{item.qty}</Text></td>
                                    <td><Text >{state.currency}{item.total}</Text></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }

                <Row type="flex" justify='space-between' align='bottom'>

                    <Col span={10}>
                        {
                            state.terms &&
                            <div>
                                <Text strong>Terms</Text>
                                <br />
                                <Text>{state.terms}</Text>
                            </div>
                        }
                        <br />
                        {
                            state.notes &&
                            <div>
                                <Text strong>Notes</Text>
                                <br />
                                <Text>{state.notes}</Text>
                            </div>
                        }
                    </Col>

                    <Col className="gutter-row" span={12}>

                        {
                            state.discountPercent !== '0' &&
                            <>
                                <Row style={{ marginBottom: '0.5rem' }}>
                                    <Col span={10}>
                                        <Text>Discount: {state.discountValue === '0' ? '0' : state.discountPercent * 100}%</Text>
                                    </Col>
                                    <Col span={14} style={{ textAlign: 'right' }}>
                                        <Text strong>{state.currency}{state.totalPrice}</Text>
                                    </Col>
                                </Row>

                                <Divider />
                            </>
                        }

                        <Row>
                            <Col span={12}>
                                <Text strong>Amount Due (USD):</Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text strong>{state.currency}{state.totalPrice}</Text>
                            </Col>
                        </Row>

                    </Col>
                </Row>
            </div>
        </div>


    )
}

const mapStateToPropos = state => {
    return {
        state
    };
};

export default connect(mapStateToPropos)(Preview);