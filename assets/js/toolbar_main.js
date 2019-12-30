Ext.ns('Wrerp.Main');

let wrerp_main_pdf_btn = new Ext.Button({
        iconCls: 'wrerp_pdf',
        scale: 'large',
        //disabled: true,
        handler: function () {
            let win = Wrerp.Main.wrerp_doc_active;
            if(win == null){
                alert('No hay nada que imprimir');
                //Validar que el documento tenga el estado requerido para imprimir;
            }else{
                if(win.doc_state == 1){
                    alert('Please, save the doc first');
                }else{
                    window.open('admin.php?page=wrerp_main&doc_id='+win.doc_num);
                }

            }
        }
});

let wrerp_main_search_btn = new Ext.Button({
    iconCls:'wrerp_search',
    scale:'large',
    handler:function(){
        win = new Ext.Window({
            layout:'fit',
            width:500,
            title:'Pepe',
            height:300,
            closeAction:'hide',
            plain: true,

            items: new Ext.TabPanel({
                autoTabs:true,
                activeTab:0,
                deferredRender:false,
                border:false
            }),

            buttons: [{
                text:'Submit',
                disabled:true
            },{
                text: 'Close',
                handler: function(){
                    win.hide();
                }
            }]
        });
        win.show(this);
    }
});

let wrerp_main_next_btn = new Ext.Button({
    iconCls: 'wrerp_next',
    scale: 'large',
    handler: function () {
        let win = Wrerp.Main.wrerp_doc_active;
        if(win != null && win.doc_num != -1){
            Ext.Ajax.request({
                url: parameters.ajax_url,
                method: 'POST',
                params: {
                    action: 'next_doc',
                    id: win.doc_num
                },
                success: function(res, opt) {
                    // Aqui debemos destruir la ventana actual y construir la ventana correspondiente al id proximo
                    //recordar crear la ventana con el sttus actualizado
                    //Tambien crear un procxedimiento que borre los elementos del quote solo si estos antes son eliminados y despues guardados
                    // con el objetiv de que si alguien borra los elementos de un quote y despues le den candelar estos no sean borrados
                    let response = Ext.decode(res.responseText);
                    win.destroy();
                    win_quo = new Wrerp.Sales.winQuotation({
                        title: 'Sales Quotation No. '+ response.id,
                        doc_num:response.id,
                        doc_state: response.doc_state
                    }).show();
                    Wrerp.Main.wrerp_doc_quo = win_quo;
                },
                failure: function() {
                    Ext.Msg.show({title:'Error', msg: 'We could not complete te transaction, there was a server issue',icon: Ext.MessageBox.ERROR, cls:'wrerp_window_dialog'});
                }
            });
        }
    }
});

let wrerp_main_previous_btn = new Ext.Button({
    iconCls: 'wrerp_previous',
    scale: 'large',
    handler: function () {
        let win = Wrerp.Main.wrerp_doc_active;
        if(win != null && win.doc_num != -1){
            Ext.Ajax.request({
                url: parameters.ajax_url,
                method: 'POST',
                params: {
                    action: 'previous_doc',
                    id: win.doc_num
                },
                success: function(res, opt) {
                    let response = Ext.decode(res.responseText);
                    win.destroy();
                    win_quo = new Wrerp.Sales.winQuotation({
                        title: 'Sales Quotation No. '+ response.id,
                        doc_num:response.id,
                        doc_state: response.doc_state
                    }).show();
                    Wrerp.Main.wrerp_doc_quo = win_quo;
                },
                failure: function() {
                    Ext.Msg.show({title:'Error', msg: 'We could not complete te transaction, there was a server issue',icon: Ext.MessageBox.ERROR, cls:'wrerp_window_dialog'});
                }
            });
        }

    }
});

let wrerp_toolbar_admin = new Ext.Toolbar({
    height:45,
    cls:'wrerp_toolbar_admin',
    items:[{
        iconCls:'wrerp_print',
        scale:'large',
        handler:function(){
           Ext.Msg.alert('Info', 'Hi sally human, this feature is not implemented yet');
        }
    },
    '-',
    wrerp_main_pdf_btn,
    '-',wrerp_main_search_btn,'-',wrerp_main_previous_btn,'-',wrerp_main_next_btn
        ]
});

