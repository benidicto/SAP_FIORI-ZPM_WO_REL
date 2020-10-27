sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"ZPM_WO/model/formatter"
], function(BaseController, MessageBox, History, MessageToast, formatter) {
	"use strict";
	return BaseController.extend("ZPM_WO.controller.page4", {
		formatter: formatter,
		onInit: function() {
			sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.handleRouteMatched, this);
		},
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		handleRouteMatched: function(oEvent) {
			var oParameters = oEvent.getParameters();
			if (oParameters.name !== "Page4") {
				return;
			}
			this.Aufnr = oParameters.arguments.Aufnr;
			//Bind Entity
			this.getwohdr(this.Aufnr);
			this.getwoopr(this.Aufnr);
		},
		getwohdr: function(oAufnr) {
			var oTableComponent = this.getView().byId("IdTableHeader");
			// Create an object of filters
			this._mFilters = [new sap.ui.model.Filter("Aufnr", sap.ui.model.FilterOperator.EQ, oAufnr)];
			var oFilter = new sap.ui.model.Filter({
				filters: this._mFilters,
				and: true
			});
			//Filter Data  
			oTableComponent.getBinding("items").filter([oFilter]);
			oTableComponent.setBusy(false);
		},
		getwoopr: function(oAufnr) {
			var oTableComponent = this.getView().byId("IdTableOperation");
			// Create an object of filters
			this._mFilters = [new sap.ui.model.Filter("Aufnr", sap.ui.model.FilterOperator.EQ, oAufnr)];
			var oFilter = new sap.ui.model.Filter({
				filters: this._mFilters,
				and: true
			});
			//Filter Data  
			oTableComponent.getBinding("items").filter([oFilter]);
			oTableComponent.setBusy(false);
		},
		_onNavButtonPress: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("Page1");
			}
		},
		getWoCom: function(oEvent) {
			var oAufnr = this.Aufnr;
			var oVornr = oEvent.getSource().getTitle();

			this.getRouter().navTo("Page5", {
				from: "Page4",
				Aufnr: oAufnr,
				Vornr: oVornr
			});
		},
		WoRel: function(oEvent) {
			var oView = this.getView(),
				oModel = oView.getModel();

			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			var oComponentTable = oView.byId("IdTableHeader");
			var countComponent = oView.byId("IdTableHeader").getItems().length,
				oComponentItems = oView.byId("IdTableHeader").getItems();
			var row;
			var itemObject;
			var context;
			for (var i = 0; i < countComponent; i++) {
				row = oComponentItems[i];
				context = row.getBindingContext();
				itemObject = context.getObject();
				var oAufnr = itemObject.Aufnr;
			}

			MessageBox.show("Are you sure want to Release ?", {
				icon: MessageBox.Icon.QUESTION,
				title: "Save",
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				onClose: function(oAction) {
					console.log(oAction);
					if (oAction === "OK") {
						oView.setBusy(true);

						oModel.create("/wo_hdr_relSet", {
							"Aufnr": oAufnr
						}, {
							success: function(oData, oResponse) {
								// Success 
								console.log(oResponse);
								if (oData.Message[0] === "E") {
									oView.setBusy(false);
									MessageBox.show(oData.Message, {
										icon: MessageBox.Icon.ERROR,
										title: "Error",
										actions: [MessageBox.Action.OK],
										onClose: function(oAction) {
											if (oAction === "OK") {
												if (sPreviousHash !== undefined) {
													//	window.history.go(-1);
												} else {
													//	this.getRouter().navTo("Page1");
												}
											}
										}
									});
								}
								if (oData.Message[0] === "S") {
									MessageBox.show("Data Saved", {
										icon: MessageBox.Icon.SUCCESS,
										title: "Success",
										actions: [MessageBox.Action.OK],
										onClose: function(oAction) {
											if (oAction === "OK") {
												oView.setBusy(false);
												if (sPreviousHash !== undefined) {
													window.history.go(-1);
												} else {
													this.getRouter().navTo("Page1");
												}
											}
										}
									});
								}
							},
							error: function(oError) {
								// Error
								oView.setBusy(false);
								console.log(oError);
							}
						});

						//	oView.setBusy(false); 
					} else {
						return;
					}

				}
			});

		}
	});
});