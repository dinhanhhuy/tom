const core = require('../core');
const moment = require('moment');
const timeoutApi = 50000;
const data = {
    
};
const expect = {
    order: {
        quotation: {
            product_money: 20000,
            ship_money: 0,
            service_money: 20000,
        },
    },
    promotion_code: {
        PC1528706877: 0,
    },
};

let result;
describe('Example 1:', () => {
    result = {};
    it('truncate db', async function () {

    });
    it('create user order', async function () {
        this.timeout(timeoutApi);
        let res = await core
            .requestApi({
                method: 'post',
                url: '/user/user_order',
            })
            .set('user_authorization', core.user_token)
            .send({
                store_id: data.order.store_id,
                receive_name: data.order.receive_name,
                receive_phone: data.order.receive_phone,
                note: data.order.note,
                shipping_receive_address: data.order.receive_address,
                shipping_receive_lat: data.order.receive_lat,
                shipping_receive_lng: data.order.receive_lng,
                shipping_receive_time: data.order.receive_time,
                list_product: data.order.list_product,
            });
        core.logInfo('>>>', JSON.stringify(res.body));
        core.logInfo('>>>', JSON.stringify(res));

        res.body.meta.success.should.be.true;
        result.create_time = moment();
        result.user_order_uuid = res.body.data;
        core.logInfo(result.user_order_uuid);
    });
    if (data.promotion_code.length > 0) {
        it('calculate promotion code', async function () {
            this.timeout(timeoutApi);
            let res = await core
                .requestApi({
                    method: 'get',
                    url: '/user/promotion_code/value',
                })
                .set('user_authorization', core.user_token)
                .query({
                    user_order_uuid: result.user_order_uuid,
                    list_code: data.promotion_code,
                });
            res.body.meta.success.should.be.true;
            result.promotion_code = res.body.data;
        });
    }
    if (data.payment.method === 'cod') {
        it('submit user order', async function () {
            this.timeout(timeoutApi);
            // let socketData = core.listenSocket({ data, group: 'admin', event: 'user_order/state_changed' });
            let res = await core
                .requestApi({
                    method: 'put',
                    url: '/user/user_order/submit',
                })
                .set('user_authorization', core.user_token)
                .send({
                    user_order_uuid: result.user_order_uuid,
                    payment_method_code: data.payment.method,
                    payment_gateway_data: data.payment.gateway_data,
                    promotion_codes: data.promotion_code,
                });
            
            res.body.meta.success.should.be.true;
            result.payment = res.body.data.payment_data;
            result.submit_time = moment();
            
            // socketData = await socketData;
            // socketData.user_order_uuid.should.equal(result.user_order_uuid);
            // socketData.old_state.should.equal('draft');
            // socketData.new_state.should.equal('submitted');
            core.logInfo('result.payment:', JSON.stringify(result.payment));
        });
    } else {
        it('pay user order', async function () {
            this.timeout(timeoutApi);
            // let socketData = core.listenSocket({ data, group: 'admin', event: 'user_order/state_changed' });
            let res = await core
                .requestApi({
                    method: 'put',
                    url: '/user/user_order/submit',
                })
                .set('user_authorization', core.user_token)
                .send({
                    user_order_uuid: result.user_order_uuid,
                    payment_method_code: data.payment.method,
                    payment_gateway_data: data.payment.gateway_data,
                    promotion_codes: data.promotion_code,
                });
            res.body.meta.success.should.be.true;
            result.payment = res.body.data.payment_data;
            result.submit_time = moment();
            // socketData = await socketData;
            // socketData.user_order_uuid.should.equal(result.user_order_uuid);
            // socketData.old_state.should.equal('draft');
            // socketData.new_state.should.equal('payment');
            core.logInfo(JSON.stringify(result.payment));
        });
        it('submit user order', async function () {
            this.timeout(timeoutApi);
            // let socket1Data = core.listenSocket({ data, group: 'admin', event: 'user_order/state_changed' });
            // let socket2Data = core.listenSocket({ data, group: 'admin', event: 'user_order/new_submit' });
            let res = await core
                .requestApi({
                    method: 'put',
                    url: '/admin/user_order/update_state',
                })
                .set('admin_authorization', core.admin_token)
                .send({
                    user_order_uuid: result.user_order_uuid,
                    state: 'submitted',
                });
            res.body.meta.success.should.be.true;
            result.assign_time = moment();
            // socket1Data = await socket1Data;
            // socket1Data.user_order_uuid.should.equal(result.user_order_uuid);
            // socket1Data.old_state.should.equal('payment');
            // socket1Data.new_state.should.equal('submitted');
            // socket2Data = await socket2Data;
            // socket2Data.user_order_uuid.should.equal(result.user_order_uuid);
        });
    }

    it('confirm user order', async function () {
        this.timeout(timeoutApi);
        // let socketData = core.listenSocket({ data, group: 'admin', event: 'user_order/state_changed' });
        let res = await core
            .requestApi({
                method: 'put',
                url: '/admin/user_order/confirm',
            })
            .set('admin_authorization', core.admin_token)
            .send({
                user_order_uuid: result.user_order_uuid,
            });
        core.logInfo(JSON.stringify(res.body.data));
        res.body.meta.success.should.be.true;
        result.confirm_time = moment();
        // socketData = await socketData;
        // socketData.user_order_uuid.should.equal(result.user_order_uuid);
        // socketData.old_state.should.equal('submitted');
        // socketData.new_state.should.equal('confirmed');
    });
    it('assign user order', async function () {
        this.timeout(timeoutApi);
        // let socketData = core.listenSocket({ data, group: 'admin', event: 'user_order/state_changed' });
        let res = await core
            .requestApi({
                method: 'put',
                url: '/admin/user_order/update_state',
            })
            .set('admin_authorization', core.admin_token)
            .send({
                user_order_uuid: result.user_order_uuid,
                state: 'assigned',
            });
        res.body.meta.success.should.be.true;
        result.assign_time = moment();
        // socketData = await socketData;
        // socketData.user_order_uuid.should.equal(result.user_order_uuid);
        // socketData.old_state.should.equal('confirmed');
        // socketData.new_state.should.equal('assigned');
    });
    it('picked user order', async function () {
        this.timeout(timeoutApi);
        // let socketData = core.listenSocket({ data, group: 'admin', event: 'user_order/state_changed' });
        let res = await core
            .requestApi({
                method: 'put',
                url: '/admin/user_order/update_state',
            })
            .set('admin_authorization', core.admin_token)
            .send({
                user_order_uuid: result.user_order_uuid,
                state: 'picked',
            });
        res.body.meta.success.should.be.true;
        result.picked_time = moment();
        // socketData = await socketData;
        // socketData.user_order_uuid.should.equal(result.user_order_uuid);
        // socketData.old_state.should.equal('assigned');
        // socketData.new_state.should.equal('picked');
    });
    it('complete user order', async function () {
        this.timeout(timeoutApi);
        // let socketData = core.listenSocket({ data, group: 'admin', event: 'user_order/state_changed' });
        let res = await core
            .requestApi({
                method: 'put',
                url: '/admin/user_order/update_state',
            })
            .set('admin_authorization', core.admin_token)
            .send({
                user_order_uuid: result.user_order_uuid,
                state: 'completed',
            });
        res.body.meta.success.should.be.true;
        result.complete_time = moment();
        // socketData = await socketData;
        // socketData.user_order_uuid.should.equal(result.user_order_uuid);
        // socketData.old_state.should.equal('picked');
        // socketData.new_state.should.equal('completed');
    });
    return;
    describe('check user order', () => {
        it('check status', async function () {
            this.timeout(timeoutApi);
            let res = await core
                .requestApi({
                    method: 'get',
                    url: '/user/user_order/detail',
                })
                .set('user_authorization', core.user_token)
                .query({
                    user_order_uuid: result.user_order_uuid,
                });
            res.body.meta.success.should.be.true;
            result.user_order = res.body.data;
            result.user_order.state.should.equal('completed');
        });
        describe('check money', () => {
            it('product money', async function () {
                let quotation = result.user_order.list_quotation.find(x => x.code === 'product_money');
                quotation.money.should.equal(expect.order.quotation.product_money);
            });
            it('service money', async function () {
                let quotation = result.user_order.list_quotation.find(x => x.code === 'service_money');
                quotation.money.should.equal(expect.order.quotation.service_money);
            });
            it('ship money', async function () {
                let quotation = result.user_order.list_quotation.find(x => x.code === 'ship_money');
                quotation.money.should.equal(expect.order.quotation.ship_money);
            });
            it('promotion money', async function () {
                let quotation = result.user_order.list_quotation.find(x => x.code === 'promotion_money');
                let expectMoney = 0;
                for (let code in expect.promotion_code)
                    expectMoney += expect.promotion_code[code]
                quotation.money.should.equal(expectMoney);
            });
            it('total money', async function () {
                let expectMoney = 0;
                for (let key in expect.order.quotation)
                    expectMoney += expect.order.quotation[key];
                for (let code in expect.promotion_code)
                    expectMoney += expect.promotion_code[code]
                if (expectMoney < 0)
                    expectMoney = 0;
                
                result.user_order.money.should.equal(expectMoney);
            });
        });
    });
    describe('check user order tracking', () => {
        let trackingIndex, time;
        it('check workflow', async function () {
            ['draft', 'submitted', 'confirmed', 'assigned', 'picked', 'completed', 'payment']
                .should.include.members(result.user_order.list_tracking.map(x => x.state));
        });
        it('create time', async function () {
            trackingIndex = result.user_order.list_tracking.findIndex(x => x.state === 'draft');
            time = Math.abs(moment.duration(result.create_time.diff(moment(result.user_order.create_date))).minutes());
            time.should.equal(0);
            time = Math.abs(moment.duration(result.create_time.diff(moment(result.user_order.list_tracking[trackingIndex].start_date))).minutes());
            time.should.equal(0);
        });
        it('submit time', async function () {
            trackingIndex = result.user_order.list_tracking.findIndex(x => x.state === 'submitted');
            time = Math.abs(moment.duration(result.submit_time.diff(moment(result.user_order.submit_date))).minutes());
            time.should.equal(0);
            time = Math.abs(moment.duration(result.submit_time.diff(moment(result.user_order.list_tracking[trackingIndex].start_date))).minutes());
            time.should.equal(0);
            time = Math.abs(moment.duration(result.submit_time.diff(moment(result.user_order.list_tracking[trackingIndex - 1].end_date))).minutes());
            time.should.equal(0);
        });
        it('confirm time', async function () {
            trackingIndex = result.user_order.list_tracking.findIndex(x => x.state === 'confirmed');
            time = Math.abs(moment.duration(result.confirm_time.diff(moment(result.user_order.confirm_date))).minutes());
            time.should.equal(0);
            time = Math.abs(moment.duration(result.confirm_time.diff(moment(result.user_order.list_tracking[trackingIndex].start_date))).minutes());
            time.should.equal(0);
            time = Math.abs(moment.duration(result.confirm_time.diff(moment(result.user_order.list_tracking[trackingIndex - 1].end_date))).minutes());
            time.should.equal(0);
        });
        it('assign time', async function () {
            trackingIndex = result.user_order.list_tracking.findIndex(x => x.state === 'assigned');
            time = Math.abs(moment.duration(result.assign_time.diff(moment(result.user_order.list_tracking[trackingIndex].start_date))).minutes());
            time.should.equal(0);
            time = Math.abs(moment.duration(result.assign_time.diff(moment(result.user_order.list_tracking[trackingIndex - 1].end_date))).minutes());
            time.should.equal(0);
        });
        it('picked time', async function () {
            trackingIndex = result.user_order.list_tracking.findIndex(x => x.state === 'picked');
            time = Math.abs(moment.duration(result.picked_time.diff(moment(result.user_order.list_tracking[trackingIndex].start_date))).minutes());
            time.should.equal(0);
            time = Math.abs(moment.duration(result.picked_time.diff(moment(result.user_order.list_tracking[trackingIndex - 1].end_date))).minutes());
            time.should.equal(0);
        });
        it('complete time', async function () {
            trackingIndex = result.user_order.list_tracking.findIndex(x => x.state === 'completed');
            time = Math.abs(moment.duration(result.complete_time.diff(moment(result.user_order.complete_date))).minutes());
            time.should.equal(0);
            time = Math.abs(moment.duration(result.complete_time.diff(moment(result.user_order.list_tracking[trackingIndex].start_date))).minutes());
            time.should.equal(0);
            time = Math.abs(moment.duration(result.confirm_time.diff(moment(result.user_order.list_tracking[trackingIndex].end_date))).minutes());
            time.should.equal(0);
            time = Math.abs(moment.duration(result.confirm_time.diff(moment(result.user_order.list_tracking[trackingIndex - 1].end_date))).minutes());
            time.should.equal(0);
        });
    });
});