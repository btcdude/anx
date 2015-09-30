var Anx = require("anx"),
    BigNumber = require('bignumber.js'),
    async = require('async');

describe("anx unit tests", function()
{
    var anxClient;

    beforeEach(function()
    {
        anxClient = new Anx(
            "key",
            "secret",
            'BTCUSD',
            'https://test.anxpro.com'
        );
    });

    it("add buy order, add second buy order, replace second order, cancel second order, cancel first order", function()
    {
        var finished = false,
            balances = {},
            orders = [];

        async.series([
            // set starting balances
            function(callback)
            {
                anxClient.info(function(err, json)
                {
                    expect(err).toBeNull;
                    if (err) return callback(err);

                    expect(json).toBeDefined();
                    expect(json.data).toBeDefined();
                    expect(Object.keys(json.data.Wallets).length).toEqual(16);

                    Object.keys(json.data.Wallets).forEach(function(currency)
                    {
                        balances[currency] = {
                            total: parseFloat(json.data.Wallets[currency].Balance.value),
                            available: parseFloat(json.data.Wallets[currency].Available_Balance.value)
                        }
                    })

                    expect(balances.USD.total).toBeGreaterThan(0);
                    expect(balances.USD.available).toBeGreaterThan(0);
                    expect(balances.BTC.total).toBeGreaterThan(0);
                    expect(balances.BTC.available).toBeGreaterThan(0);

                    callback(null);
                });
            },

            // add first buy order
            function(callback)
            {
                var amount = '1.11111111',
                    rate = '530.11111';

                anxClient.newLimitOrderFixedTradedAmount(
                    true,
                    'BTC',
                    'USD',
                    amount,
                    rate,
                    function(err, json)
                    {
                        expect(err).toBeNull();
                        if (err) return callback(err);

                        expect(json.orderId).not.toBeNull();
                        expect(json.timestamp).toBeDefined();

                        orders[0] = {
                            id: json.orderId,
                            amount: amount,
                            rate: rate
                        };

                        callback(null);
                    }
                );
            },

            // add second buy order
            function(callback)
            {
                var amount = '1.22222222',
                    rate = '535.22222';

                anxClient.newLimitOrderFixedTradedAmount(
                    true,
                    'BTC',
                    'USD',
                    amount,
                    rate,
                    function(err, json)
                    {
                        expect(err).toBeNull();
                        if (err) return callback(err);

                        expect(json.orderId).not.toBeNull();
                        expect(json.timestamp).toBeDefined();

                        orders[1] = {
                            id: json.orderId,
                            amount: amount,
                            rate: rate
                        };

                        callback(null);
                    }
                );
            },

            // replace second buy order with third order
            function(callback)
            {
                var amount = '1.33333333',
                    rate = '540.33333';

                anxClient.replaceLimitOrderFixedTradedAmount(
                    true,
                    'BTC',
                    'USD',
                    amount,
                    rate,
                    orders[1].id,
                    true,
                    function(err, json)
                    {
                        expect(err).toBeNull();
                        if (err) return callback(err);

                        expect(json.orderId).not.toBeNull();
                        expect(json.timestamp).toBeDefined();

                        orders[2] = {
                            id: json.orderId,
                            amount: amount,
                            rate: rate
                        };

                        callback(null);
                    }
                );
            },

            // replace thrid buy order with forth order
            function(callback)
            {
                var amount = '1.44444444',
                    rate = '545.44444';

                anxClient.replaceLimitOrderFixedTradedAmount(
                    true,
                    'BTC',
                    'USD',
                    amount,
                    rate,
                    orders[2].id,
                    true,
                    function(err, json)
                    {
                        expect(err).toBeNull();
                        if (err) return callback(err);

                        expect(json.orderId).not.toBeNull();
                        expect(json.timestamp).toBeDefined();

                        orders[3] = {
                            id: json.orderId,
                            amount: amount,
                            rate: rate
                        };

                        callback(null);
                    }
                );
            },

            // wait 30 second for the balance cache to clear
            function(callback)
            {
                setTimeout(function()
                {
                    callback(null);
                }, 30000);
            },

            // check balances
            function(callback)
            {
                anxClient.info(function(err, json)
                {
                    expect(err).toBeNull;
                    if (err) return callback(err);

                    expect(json).toBeDefined();
                    expect(json.data).toBeDefined();
                    expect(Object.keys(json.data.Wallets).length).toEqual(16);

                    var expectedAvailable = BigNumber(balances.USD.available).
                        minus(BigNumber(orders[0].amount).
                            times(orders[0].rate)
                        ).
                        minus(BigNumber(orders[3].amount).
                            times(orders[3].rate)
                    ).round(5).
                    toString();

                    expect(json.data.Wallets.USD.Available_Balance.value).toEqual(expectedAvailable)

                    callback(null);
                });
            }

            ],
            function(err, results)
            {
                finished = true;
            }
        );

        waitsFor(function() {
            return finished;
        }, 45000);
    });
})