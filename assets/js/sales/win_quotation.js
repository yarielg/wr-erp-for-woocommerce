Ext.ns('Wrerp.Sales');

Wrerp.Sales.winQuotation= Ext.extend(Ext.Window, {
    constructor: function(options) {
        let _this = this;
        this.doc_type = 1; //Quotation doc
        this.doc_state = options.doc_state || 1; //1 = New 2 = Open 3 = Closed 4 = Canceled
        this.doc_num = options.doc_num || -1; //id in wrerp_iqut table
        this.doc_editing = options.doc_editing || false; //Flag to know when the doc is being edited
        
        this.storeProducts = new Ext.data.JsonStore({
            url: parameters.ajax_url,
            root: 'data',
            totalProperty:'total',
            baseParams: {
                    action: 'get_products_by_quo_id',
                    id:_this.doc_num
            },
            fields: ['ID','meta_value', 'post_title','price','quantity','total','_manage_stock','_stock_status','_stock'],
            listeners: {
                'update': function(store,record,operation){
                    let sum = _this.wrerp_total(store);
                    _this.tfTotal.setValue(sum.toFixed(2));
                },
                'add': function(store,records,options){
                    let sum = _this.wrerp_total(store);
                    _this.tfTotal.setValue(sum.toFixed(2));
                },
                'load': function(store,records,options){
                    let sum = _this.wrerp_total(store);
                    _this.tfTotal.setValue(sum.toFixed(2));
                }
            }
        });

        this.storeProducts.load();

        //Toolbar
        this.btnAddItem = new Ext.Button({
            text: 'Add Item',
            iconCls: 'wrerp_add',
            handler:function(){
                new Wrerp.Inv.winProducts({
                    title:'Products',
                    parentWindow: _this
                }).show();
                _this.disable();
            }
        });
        this.tbProducts = new Ext.Toolbar({
            items: [_this.btnAddItem]
        });

        this.gpProducts = new Ext.grid.EditorGridPanel({
            store: this.storeProducts,
            columnLines: true,
            frame: true,
            clicksToEdit: 1,
            columns: [
               //new Ext.grid.RowNumberer(),
                {
                    header:'ID',
                    width: 50,
                    dataIndex: 'ID',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                        metaData.css = 'wrerp_disabled_rows';
                        return value;
                    }
                },{
                    header:'SKU',
                    width: 90,
                    dataIndex: 'meta_value',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                        metaData.css = 'wrerp_disabled_rows';
                        return value;
                    }
                }
                , {
                    header: 'Name',
                    disabled:true,
                    width: 400,
                    dataIndex: 'post_title',
                    editable:false,
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                        metaData.css = 'wrerp_disabled_rows';
                        return value;
                    }
                },
                {
                    header: 'Price',
                    width: 60,
                    dataIndex: 'price',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                        metaData.css = 'wrerp_disabled_rows';
                        return value;
                    }
                }, {
                    header: 'Quantity',
                    width: 60,
                    dataIndex: 'quantity',
                    editable:true,
                    enableKeyEvents: true,
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false,
                    }

                },{
                    header: 'Total',
                    width: 60,
                    dataIndex: 'total',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                        metaData.css = 'wrerp_disabled_rows';
                        return record.get('quantity')*record.get('price')>0 ? (record.get('quantity')*record.get('price') ).toFixed(2):record.get('price').toFixed(2);
                    }
                },{
                    header: 'Stock Status',
                    width: 100,
                    dataIndex: '_stock_status',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                        metaData.css = 'wrerp_disabled_rows';
                        return value;
                    }
                },{
                    header: 'Stock',
                    width: 50,
                    dataIndex: '_stock',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                        metaData.css = 'wrerp_disabled_rows';
                        return value;
                    }
                },{
                    header: '',
                    dataIndex: 'id',
                    menuDisabled: true,
                    width: 30,
                    renderer: function(value, meta, record) {
                            //if(_this.doc_state == 1){
                                meta.css = 'wrerp_delete';
                           // }
                    }
                }
            ]
            ,tbar: _this.tbProducts,
            listeners: {
                "cellclick": function(grid, row, column, event) {

                    if (column == 8) {
                        let store = _this.storeProducts;
                        let record = store.getAt(row);
                        store.remove(record);
                        let sum = _this.wrerp_total(store)
                        _this.tfTotal.setValue(sum.toFixed(2));
                    }
                }
            },
        });

        this.tfTotal = new Ext.form.TextField({
            name: 'total',
            fieldLabel: 'Total',
            //disabled:true,
            readOnly:true,
            emptyText: '0.00',
            width: 100
        });

        this.tfTax = new Ext.form.TextField({
            name: 'total',
            fieldLabel: 'Taxes',
            disabled:true,
            emptyText: '0.00',
            width: 100
        });

        this.tfGrandTotal = new Ext.form.TextField({
            name: 'total',
            fieldLabel: 'Grand Total',
            disabled:true,
            emptyText: '0.00',
            width: 100
        });

        this.tfNoQuo = new Ext.form.TextField({
            name: 'no_quotation',
            fieldLabel: 'No.',
            disabled:true,
            emptyText: _this.doc_num,
            width: 100
        });

        this.tfStatus = new Ext.form.TextField({
            name: 'status',
            fieldLabel: 'Status',
            disabled:true,
            emptyText: 'New',
            width: 100
        });

        this.tfPostingDate = new Ext.form.TextField({
            name: 'posting_date',
            fieldLabel: 'Posting Date',
            disabled:true,
            emptyText: new Date().toISOString().slice(0,10),
            width: 100
        });

        this.fpDates = new Ext.form.FormPanel({
            border: false,
            region:'east',
            defaults: {
                anchor: '95%',
                msgTarget: 'top'
            },
            bodyStyle: 'padding:10px;background-color:#FFF;',
            width: 250,
            items: [this.tfNoQuo,this.tfStatus,this.tfPostingDate]
        });

        this.fpResumen = new Ext.form.FormPanel({
            border: false,
            region:'east',
            fieldLabel: 'Total:',
           // layout:'column',
            defaults: {
                anchor: '95%',
                msgTarget: 'top'
            },
            bodyStyle: 'padding:10px;background-color:#FFF;',
            width: 250,
            items: [this.tfTotal,this.tfTax,this.tfGrandTotal]
        });

        //this function create a event to change the state oof the doc
        this.changeState = function(state){
            _this.doc_state = state;
            _this.fireEvent('changeStateDoc',_this,state);
        }

        _this.wrerp_total = function(store){
            let sum=0;
            store.each(function(record){
                sum+= parseFloat(record.get('price')) * parseFloat(record.get('quantity'));
            });
            return sum;
        }

        _this.getItems = function(store){
            let items = [];
            let cont = 0;
            store.each(function(record){
                items.push({
                    id: record.get('ID'),
                    qty: record.get('quantity')
                });
            });
            return items;
        }

        _this.valiateDoc = function(){
            if(_this.storeProducts.getCount() == 0 ){
                return false
            }
            return true;
        }

        _this.saveDoc = function(){
            let self = _this;
            if(_this.valiateDoc()){
                Ext.Ajax.request({
                    url: parameters.ajax_url,
                    method: 'POST',
                    params: {
                        action: 'insert_quo',
                        status: 2, //Status/State open
                        posting_date: new Date().toISOString().slice(0,10),
                        customer_id: 2,
                        remarks: 'this is a remarks',
                        items : JSON.stringify(self.getItems(self.storeProducts)),

                    },
                    success: function(res, opt) {
                        //Cuando agregamos el doc lanzamos changeState para preparanos para el nuevo escenario.
                        Wrerp.Main.wrerp_doc_quo = new Wrerp.Sales.winQuotation({
                            title: 'Sales Quotation No. '+ _this.tfNoQuo.getValue(),
                            doc_num:_this.tfNoQuo.getValue(),
                            doc_state: '2'
                        }).show();
                        _this.destroy();

                    },
                    failure: function() {
                        Ext.Msg.show({title:'Error', msg: 'We could not complete te transaction, there was a server issue',icon: Ext.MessageBox.ERROR, cls:'wrerp_window_dialog'});
                    },
                    maskCfg:{
                        msg: 'Creating...'
                    }
                });
            }else{
                Ext.Msg.show({title:'Error', msg: 'You need to add at least a product', icon: Ext.MessageBox.ERROR, cls:'wrerp_window_dialog'});
            }
        }

        this.updateDoc = function(){
            alert('Yeah');
        }

        this.loadDocID = function(text){
            Ext.Ajax.request({
                url: parameters.ajax_url,
                method: 'POST',
                params: {
                    action: 'get_doc_id',
                },
                success: function(res, opt) {
                    let response = Ext.decode(res.responseText);
                    text.setValue(parseInt(response.id) + 1 );
                },
                failure: function() {
                    Ext.Msg.show({title:'Error', msg: 'We could not complete te transaction, there was a server issue',icon: Ext.MessageBox.ERROR, cls:'wrerp_window_dialog'});
                }
            });
        }

        //Win buttons
        this.btncreateUpdate = new Ext.Button({
            text:_this.doc_state != 1 ? 'Update': 'Create',
            handler: function(){
                if(_this.doc_state != 1){
                    _this.updateDoc();
                }else{
                    _this.saveDoc();
                }
            }
        });
        //Default component properties
        Wrerp.Sales.winQuotation.superclass.constructor.apply(this, [{
            title: _this.title,
            //modal: true,
            layout: 'border',
            y:178,
            x:265,
            frame: true,
            cls: 'wrerp_window',
            iconCls: 'wrerp_documents',
            height:550,
            width: 1080,
            maximizable:true,
            resizable: true,
            //minimizable : true,
            items: [{
                xtype: 'panel',
                region: 'north',
                layout: 'border',
                bodyStyle: 'background-color:#FFF;',
                height:120,
                items:[{
                    xtype:'panel',
                    region:'center',
                    border:false,
                },
                    _this.fpDates
                ]
            },{
                xtype: 'panel',
                region:'center',
                layout: 'fit',
                items:[_this.gpProducts]
            },{
                xtype: 'panel',
                region: 'south',
                layout: 'border',
                bodyStyle: 'background-color:#FFF;',
                height:120,
                items:[{
                    xtype:'panel',
                    region:'center',
                    border:false,
                },
                    _this.fpResumen
                ]
            }],
            buttons: [_this.btncreateUpdate,{
                text:'Cancel',
                handler:function(){
                    if((_this.storeProducts.getCount()>0 &&  _this.doc_state == 1) || (_this.doc_editing && _this.doc_state == 2)){
                        Ext.MessageBox.show({
                            title:'Do you want to continue?',
                            cls:'wrerp_window_dialog',
                            msg: 'You are closing this window that has unsaved changes. <br />Would you like to continue?',
                            buttons: Ext.MessageBox.YESNO,
                            fn: function(btn){
                                if(btn == 'yes'){
                                    //Before close change the doc quo instance to null
                                    Wrerp.Main.wrerp_doc_quo = null;
                                    _this.destroy();
                                }
                            },
                            icon: Ext.MessageBox.QUESTION
                        });
                    }else{
                        _this.destroy();
                        Wrerp.Main.wrerp_doc_quo = null;
                    }

                }
            }],
            listeners:{
                beforeclose:function(panel){
                        let self = _this;
                        if(_this.storeProducts.getCount()>0){
                            Ext.MessageBox.show({
                                title:'Do you want to continue?',
                                cls:'wrerp_window_dialog',
                                msg: 'You are closing this window that has unsaved changes. <br />Would you like to continue?',
                                buttons: Ext.MessageBox.YESNO,
                                fn: function(btn){
                                    if(btn == 'yes'){
                                        //Before close change the doc quo instance to null
                                        Wrerp.Main.wrerp_doc_quo = null;
                                        self.destroy();
                                    }
                                },
                                icon: Ext.MessageBox.QUESTION
                            });

                            return false;
                        }
                     Wrerp.Main.wrerp_doc_quo = null;
                },
                activate:function (win) {
                    Wrerp.Main.wrerp_doc_active = win;
                },
                deactivate:function(win){
                    Wrerp.Main.wrerp_doc_active = null;
                },
                changeStateDoc:function(win,state){
                    if(state == 2){
                        //_this.btncreateUpdate.setDisabled(true);
                        _this.setTitle('Sales Quotation No. ' + _this.tfNoQuo.getValue());
                        _this.tfStatus.setValue('Open');
                        _this.btncreateUpdate.setText('Update');
                    }
                },
                beforeshow:function(){
                    if(_this.doc_num == -1){
                        _this.loadDocID(_this.tfNoQuo);
                    }
                }
            }
        }]);

        Ext.apply(this, options || {});
    }
});

