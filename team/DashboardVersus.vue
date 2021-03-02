<template lang="jade">

modal-date-option( :modal-data = "modalDateOption", v-if = "modalDateOption.show" )

div( id = "content-flex", class = "content-flex" )
    div( id = "columns-container", class = "columns-container" )
        div( v-for = "( columnIndex, column ) in columns", :id = "'column-' + column.id", style = "height: 100%;" )
            div( class = "single-column", :style = "'height: ' + setColumnHeight( column.id ) + '; color: red;'" )
                div( class = "top-nav-dropdowns" )
                    div( class = "dropdown-container", v-show = "column.topNav.accounts.options.length > 1" )
                        input-dropdown(
                            :array = "column.topNav.accounts.options",
                            :variable.sync = "column.topNav.accounts.selected",
                            :show-dropdown.sync = "false",
                            :search-bar = "true",
                            custom-theme = "nav-locations-dropdown",
                            custom-icon = "fa-user",
                            :proponchange = "updateColumn",
                            :additional-data = "{ type: 'accounts', column: column }",
                        )
                    div( class = "dropdown-container", v-show = "column.topNav.companies.options.length > 1" )
                        input-dropdown(
                            :array = "column.topNav.companies.options",
                            :variable.sync = "column.topNav.companies.selected",
                            :show-dropdown.sync = "false",
                            :search-bar = "true",
                            custom-theme = "nav-locations-dropdown",
                            custom-icon = "fa-globe",
                            :proponchange = "updateColumn",
                            :additional-data = "{ type: 'companies', column: column }",
                        )
                    div( class = "dropdown-container", v-show = "column.topNav.groups.options.length > 1" )
                        input-dropdown(
                            :array = "column.topNav.groups.options",
                            :variable.sync = "column.topNav.groups.selected",
                            :show-dropdown.sync = "false",
                            :search-bar = "true",
                            custom-theme = "nav-locations-dropdown",
                            custom-icon = "fa-sitemap",
                            :proponchange = "updateColumn",
                            :additional-data = "{ type: 'groups', column: column }",
                        )
                    div( class = "dropdown-container", v-show = "column.topNav.businesses.options.length > 1" )
                        input-dropdown(
                            :array = "column.topNav.businesses.options",
                            :variable.sync = "column.topNav.businesses.selected",
                            :show-dropdown.sync = "false",
                            :search-bar = "true",
                            custom-theme = "nav-locations-dropdown",
                            custom-icon = "fa-map-marker",
                            :proponchange = "updateColumn",
                            :additional-data = "{ type: 'businesses', column: column }",
                        )
                    div( class = "dropdown-container flex-space-between", style = "height: 80px;" )
                        div( class = "flex-left" )
                            i( class = "fa fa-calendar", style = "margin-right: 20px; color: black; cursor: pointer;", v-on:click = "openDateModal( column )" )
                            div()
                                span( class = "show-range", style = "color: black;" )
                                    span() {{ column.filterData.showFromDate }}
                                    span( class = "range-divider", v-show = "column.filterData.showToDate" ) -
                                    span() {{ column.filterData.showToDate }}
                        div( style = "text-align: right;" )
                            div()
                                //- button( class = "pure-button button-edit", v-show = "( columns.length === ( columnIndex + 1 ) )", v-on:click = "newColumn()" ) New Column
                                div( class = "options-dropdown-group", v-show = "( columns.length === ( columnIndex + 1 ) )" )
                                    div( class = "flex-center" )
                                        button(
                                            class = "pure-button button-edit",
                                            v-on:click = "newColumn()"
                                        ) New Column
                                        button( :class = "{ 'pure-button button-arrow-right button-arrow-thicker button-edit': true }", v-on:mousedown = "keepDropdownOpen( 'submitOptions' )", v-on:click = "toggleDropdown( 'submitOptions' )" )
                                            i( class = "fa fa-chevron-down", style = "margin: 0;" )

                                    div( class = "options-dropdown", style = "right: 0; text-align: left; color: black;", v-if = "showOptions.submitOptions.show", v-on:mousedown = "keepDropdownOpen( 'submitOptions' )" )
                                        div( class = "option", v-on:click = "newColumn( { location: true } )" ) Copy Location

                            div( style = "margin-top: 10px;" )
                                button( class = "pure-button button-delete", v-show = "columns.length > 1", v-on:click = "removeColumn( column )" ) Remove

                div( class = "dashboard-column" )
                    dashboard-column( :column = "column" )

</template>

<script>
import Account from '../../services/account';
import Company from '../../services/company';
import DashboardColumn from "./DashboardColumn.vue";
import InputDropdown from "../../shared/InputDropdown.vue";
import ModalDateOption from "./ModalDateOption.vue";
import Session from "../../shared/session.js";

export default {
    components: {
        DashboardColumn,
        InputDropdown,
        ModalDateOption,
    },

    data() {
        return {
            columns: [],
            session: new Session(),
            accounts: {},
            modalDateOption: {
                column: null,
                show: false,
            },
            showOptions: {
                submitOptions: {
                    show: false,
                    clicked: false,
                },
            },
            indexMonths: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ],
        };
    },

    events: {
        updateBusinessEvent: function () {
            this.setupColumns();
            // this.$broadcast( "updateBusinessEvent" );
        },

        updateFilterOptions: function () {
            console.log( "updateFilterOptions" );
            this.modalDateOption.show = false;
            this.modalDateOption.column.lastUpdated = new Date().getTime();
        },

        applicationOnClick: function () {
            var parent = this;

            Object.keys( this.showOptions ).forEach( function ( item ) {
                if ( !parent.showOptions[ item ].clicked ) {
                    parent.showOptions[ item ].show = false;
                } else {
                    parent.showOptions[ item ].clicked = false;
                }
            } );

            this.$broadcast( "applicationOnClick" );
        },
    },

    methods: {
        openDateModal: function ( column ) {
            console.log( "openDateModal" );
            this.modalDateOption.column = column;
            this.modalDateOption.show = true;
        },

        keepDropdownOpen: function ( dropdown ) {
            this.showOptions[ dropdown ].clicked = true;
        },

        toggleDropdown: function ( dropdown ) {
            this.showOptions[ dropdown ].show = !this.showOptions[ dropdown ].show;
        },

        addZero: function ( number ) {
            if ( number.toString().length == 1 ) {
                return ( "0" + number.toString() );
            } else {
                return ( number.toString() );
            }
        },

        getCompanies: function ( accountId, callback ) {
            if ( this.accounts[ accountId ] ) {
                var account = this.accounts[ accountId ];

                if ( account.companies ) {
                    callback( Object.entries( account.companies ).map( function ( item ) {
                        return item[ 1 ];
                    } ).sort( ( a, b ) => {
                        if ( b.name < a.name ) { return 1 }
                        else if ( b.name > a.name ) { return -1 }
                        else return 0
                    } ) );
                } else {
                    account.companies = {};
                    if ( accountId === this.session.getAccountId() ) {
                        JSON.parse( JSON.stringify( this.session.getData( "companies" ) ) ).forEach( company => {
                            company.businesses = null;
                            company.groups = null;
                            account.companies[ company.id ] = company;
                        } );

                        callback( Object.entries( account.companies ).map( function ( item ) {
                            return item[ 1 ];
                        } ).sort( ( a, b ) => {
                            if ( b.name < a.name ) { return 1 }
                            else if ( b.name > a.name ) { return -1 }
                            else return 0
                        } ) );
                    } else {
                        new Account( accountId ).getCompanies()
                        .then(response => {
                            response.results.forEach( company => {
                                company.businesses = null;
                                company.groups = null;
                                account.companies[ company.id ] = company;
                            } );

                            callback( Object.entries( account.companies ).map( function ( item ) {
                                return item[ 1 ];
                            } ).sort( ( a, b ) => {
                                if ( b.name < a.name ) { return 1 }
                                else if ( b.name > a.name ) { return -1 }
                                else return 0
                            } ) );
                        } );
                    }
                }
            } else {
                callback( [] );
            }
        },

        getGroupsAndBusinesses: function ( accountId, companyId, callback ) {
            if ( this.accounts[ accountId ] && this.accounts[ accountId ].companies && this.accounts[ accountId ].companies[ companyId ] ) {
                var company = this.accounts[ accountId ].companies[ companyId ];

                if ( company.businesses ) {
                    callback(
                        Object.entries( company.groups ).map( function ( item ) {
                            return item[ 1 ];
                        } ).sort( ( a, b ) => {
                            if ( b.name < a.name ) { return 1 }
                            else if ( b.name > a.name ) { return -1 }
                            else return 0
                        } ),
                        Object.entries( company.businesses ).map( function ( item ) {
                            return item[ 1 ];
                        } ).sort( ( a, b ) => {
                            if ( b.name < a.name ) { return 1 }
                            else if ( b.name > a.name ) { return -1 }
                            else return 0
                        } )
                    );
                } else {
                    company.groups = {};
                    company.businesses = {};

                    if ( companyId === this.session.getData( "selectedCompany" ).id ) {
                        var groups = this.session.getData( "groups" );
                        if ( !groups ) { groups = []; }
                        JSON.parse( JSON.stringify( groups ) ).filter( item => {
                            return ( item.id !== "All" );
                        } ).forEach( group => {
                            company.groups[ group.id ] = group;
                        } );

                        var businesses = this.session.getData( "allBusinesses" );
                        if ( !businesses ) { businesses = []; }
                        JSON.parse( JSON.stringify( businesses ) ).forEach( business => {
                            company.businesses[ business.id ] = business;
                        } );

                        callback(
                            Object.entries( company.groups ).map( function ( item ) {
                                return item[ 1 ];
                            } ).sort( ( a, b ) => {
                                if ( b.name < a.name ) { return 1 }
                                else if ( b.name > a.name ) { return -1 }
                                else return 0
                            } ),
                            Object.entries( company.businesses ).map( function ( item ) {
                                return item[ 1 ];
                            } ).sort( ( a, b ) => {
                                if ( b.name < a.name ) { return 1 }
                                else if ( b.name > a.name ) { return -1 }
                                else return 0
                            } )
                        );
                    } else {
                        new Company(companyId).getGroups()
                        .then(groupsResponse => {
                            new Company(companyId).getBusinesses()
                            .then(businessResponse => {
                                var allBusinesses = businessResponse.results;
                                groupsResponse.groups.forEach(function(httpResponseGroup) {
                                    company.groups[ httpResponseGroup.id ] = {
                                        id: httpResponseGroup.id,
                                        name: httpResponseGroup.name,
                                        businesses: allBusinesses.filter(function(business){
                                            return httpResponseGroup.businessIds.indexOf(business.id) > -1;
                                        } ),
                                    };
                                } );

                                businessResponse.results.forEach( business => {
                                    company.businesses[ business.id ] = business;
                                } );

                                callback(
                                    Object.entries( company.groups ).map( function ( item ) {
                                        return item[ 1 ];
                                    } ).sort( ( a, b ) => {
                                        if ( b.name < a.name ) { return 1 }
                                        else if ( b.name > a.name ) { return -1 }
                                        else return 0
                                    } ),
                                    Object.entries( company.businesses ).map( function ( item ) {
                                        return item[ 1 ];
                                    } ).sort( ( a, b ) => {
                                        if ( b.name < a.name ) { return 1 }
                                        else if ( b.name > a.name ) { return -1 }
                                        else return 0
                                    } )
                                );
                            } );
                        } );
                    }
                }
            } else {
                callback( [] );
            }
        },

        parseDate: function ( params ) {
            var date;

            if ( !params.string ) {
                date = new Date();
            } else {
                date = new Date( params.string );
                if ( date == "Invalid Date" ) { return null; }
            }

            if ( params.UTC && params.filter ) {
                var month = date.getUTCMonth() + 1;
                var day = date.getUTCDate();
                var year = date.getUTCFullYear();

                return ( year + "-" + this.addZero( month ) + "-" + this.addZero( day ) );
            } else if ( params.UTC ) {
                var month = this.indexMonths[ date.getUTCMonth() ];
                var day = date.getUTCDate();
                var year = date.getUTCFullYear();

                return ( month + " " + day + ", " + year );
            } else if ( params.filter ) {
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var year = date.getFullYear();

                return ( year + "-" + this.addZero( month ) + "-" + this.addZero( day ) );
            } else {
                var month = this.indexMonths[ date.getMonth() ];
                var day = date.getDate();
                var year = date.getFullYear();

                return ( month + " " + day + ", " + year );
            }
        },

        getDateString: function ( days ) {
            var today = new Date();
            var priorDate = new Date(today.setDate(today.getDate() - days));

            return [
                this.parseDate( { string: priorDate } ),
                this.parseDate( { string: "" } ),
                this.parseDate( { string: priorDate, filter: true } ),
                this.parseDate( { string: "", filter: true } )
            ];
        },

        getDefaultColumn: function ( params, callback ) {
            var date = new Date().getTime();
            var accounts = Object.entries( this.accounts ).map( item => {
                return item[ 1 ];
            } ).sort( ( a, b ) => {
                if ( b.name < a.name ) { return 1 }
                else if ( b.name > a.name ) { return -1 }
                else return 0
            } );
            var accountId = this.session.getAccountId();
            this.getCompanies( accountId, ( companies ) => {
                var companyId = companies[ 0 ].id;

                this.getGroupsAndBusinesses( accountId, companyId, ( groups, businesses ) => {
                    groups.unshift( {
                        name: "All Districts",
                        id: "All",
                    } );
                    businesses.unshift( {
                        name: "All Locations",
                        id: "All",
                    } );

                    var days;
                    var dateRange;
                    if ( this.columns[ this.columns.length - 1 ] ) {
                        days = this.columns[ this.columns.length - 1 ].filterData.selectedDate;
                        dateRange = [
                            this.columns[ this.columns.length - 1 ].filterData.showFromDate,
                            this.columns[ this.columns.length - 1 ].filterData.showToDate,
                            this.columns[ this.columns.length - 1 ].filterData.fromDate,
                            this.columns[ this.columns.length - 1 ].filterData.toDate
                        ];
                    } else {
                        days = 30;
                        dateRange = this.getDateString( days );
                    }

                    var selectedAccount = this.accounts[ accountId ];
                    var selectedCompany = companies[ 0 ];
                    var selectedGroup = groups[ 0 ];
                    var selectedBusiness = businesses[ 0 ];

                    if ( params && params.location ) {
                        if ( this.columns[ this.columns.length - 1 ] ) {
                            accounts = this.columns[ this.columns.length - 1 ].topNav.accounts.options;
                            companies = this.columns[ this.columns.length - 1 ].topNav.companies.options;
                            groups = this.columns[ this.columns.length - 1 ].topNav.groups.options;
                            businesses = this.columns[ this.columns.length - 1 ].topNav.businesses.options;
                            selectedAccount = this.columns[ this.columns.length - 1 ].topNav.accounts.selected;
                            selectedCompany = this.columns[ this.columns.length - 1 ].topNav.companies.selected;
                            selectedGroup = this.columns[ this.columns.length - 1 ].topNav.groups.selected;
                            selectedBusiness = this.columns[ this.columns.length - 1 ].topNav.businesses.selected;
                        }
                    }

                    callback( {
                        id: date,
                        topNav: {
                            accounts: {
                                options: accounts,
                                selected: selectedAccount,
                            },
                            companies: {
                                options: companies,
                                selected: selectedCompany,
                            },
                            groups: {
                                options: groups,
                                selected: selectedGroup,
                            },
                            businesses: {
                                options: businesses,
                                selected: selectedBusiness,
                            },
                        },
                        lastUpdated: date,
                        filterData: {
                            fromDate: dateRange[ 2 ],
                            toDate: dateRange[ 3 ],
                            showFromDate: dateRange[ 0 ],
                            showToDate: dateRange[ 1 ],
                            selectedDate: days,
                        },
                    } );
                } );
            } );
        },

        setupColumns: function () {
            this.getDefaultColumn( null, ( newColumn ) => {
                this.columns = [ newColumn ];
            } );
        },

        newColumn: function ( params ) {
            this.showOptions.submitOptions.show = false;

            this.getDefaultColumn( params, ( newColumn ) => {
                this.columns.push( newColumn );

                setTimeout( function () {
                    var columnsContainer = document.getElementById( "columns-container" );
                    columnsContainer.scrollLeft = columnsContainer.scrollWidth;
                }, 0 );
            } );
        },

        updateColumn: function( selected, dropdownData ) {
            if ( dropdownData.type === "accounts" ) {
                var accountId = dropdownData.column.topNav.accounts.selected.id;
                this.getCompanies( accountId, ( companies ) => {
                    dropdownData.column.topNav.companies.options = companies;
                    dropdownData.column.topNav.companies.selected = companies[ 0 ];
                    var companyId = dropdownData.column.topNav.companies.selected.id;

                    this.getGroupsAndBusinesses( accountId, companyId, ( groups, businesses ) => {
                        groups.unshift( {
                            name: "All Districts",
                            id: "All",
                        } );
                        businesses.unshift( {
                            name: "All Locations",
                            id: "All",
                        } );
                        dropdownData.column.topNav.groups.options = groups;
                        dropdownData.column.topNav.groups.selected = groups[ 0 ];
                        dropdownData.column.topNav.businesses.options = businesses;
                        dropdownData.column.topNav.businesses.selected = businesses[ 0 ];

                        // Reload the column. DashboardColumn.vue has a watcher that checks for this value
                        dropdownData.column.lastUpdated = new Date().getTime();
                    } );
                } );
            } else if ( dropdownData.type === "companies" ) {
                var accountId = dropdownData.column.topNav.accounts.selected.id;
                var companyId = dropdownData.column.topNav.companies.selected.id;

                this.getGroupsAndBusinesses( accountId, companyId, ( groups, businesses ) => {
                    groups.unshift( {
                        name: "All Districts",
                        id: "All",
                    } );
                    businesses.unshift( {
                        name: "All Locations",
                        id: "All",
                    } );

                    dropdownData.column.topNav.groups.options = groups;
                    dropdownData.column.topNav.groups.selected = groups[ 0 ];
                    dropdownData.column.topNav.businesses.options = businesses;
                    dropdownData.column.topNav.businesses.selected = businesses[ 0 ];

                    // Reload the column. DashboardColumn.vue has a watcher that checks for this value
                    dropdownData.column.lastUpdated = new Date().getTime();
                } );
            } else if ( dropdownData.type === "groups" ) {
                // Reload the column. DashboardColumn.vue has a watcher that checks for this value
                dropdownData.column.lastUpdated = new Date().getTime();
            } else if ( dropdownData.type === "businesses" ) {
                // Reload the column. DashboardColumn.vue has a watcher that checks for this value
                dropdownData.column.lastUpdated = new Date().getTime();
            }
        },

        removeColumn: function ( column ) {
            this.columns = this.columns.filter( oldColumn => {
                return ( oldColumn !== column );
            } );
        },

        setColumnHeight: function ( columnId ) {
            setTimeout( function () {
                var parentElement = document.getElementById( "content-flex" );
                if ( parentElement ) {
                    parentElement.children[ 0 ].style.height = ( ( parentElement.offsetHeight - 20 ) + "px" );
                } else {
                    return "800px";
                }
            }, 1 );
        },
    },

    ready: function () {
        this.$dispatch( "setBusinessList", "hideAccount", true );
        this.$dispatch('toggleHeaderAndNav', true);
        this.setColumnHeight();

        var parent = this;
        if ( parent.session.getData( "accounts" ) ) {
            JSON.parse( JSON.stringify( parent.session.getData( "accounts" ) ) ).forEach( account => {
                account.checked = false;
                account.companies = null;
                parent.accounts[ account.id ] = account;
            } );
        } else {
            parent.accounts[ this.session.getAccountId() ] = {
                checked: false,
                companies: null,
                id: this.session.getAccountId(),
            };
        }

        parent.setupColumns();
    },

    route: {
        activate(transition) {
            this.$dispatch("highlightSettings", "dashboard", "dashboard" );

            try {
                return this.session.getData("getAndSaveUserAccountEntitiesIfNotPresent");
            } catch(err) {
                this.$dispatch("highlightSettings", false );
                transition.redirect('/dashboard');
                this.$dispatch("setBusinessList", "normal");
            }
        },

        deactivate(transition) {
            this.$dispatch( "setBusinessList", "default", true );
            this.$dispatch("highlightSettings", false );
            transition.next();
        },

        canReuse: false
    },
}

</script>

<style lang="stylus" scoped>
@import "../../styles/globals";

.content-flex
    width: calc( 100% - 40px );

.action-buttons
    padding-bottom: 10px;

.columns-container
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: calc( 100% - 40px );
    overflow-x: scroll;
    overflow-y: auto;

.single-column
    width: 400px;
    // padding: 0 10px;
    // height: 600px;
    // height: 100%;
    // overflow-y: scroll;
    flex-shrink: 0;

.top-nav-dropdowns
    .dropdown-container
        padding-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;

.options-dropdown-group
    position: relative;

    .options-dropdown
        position: absolute;
        // Place dropdown on top of other relatively positioned buttons
        z-index: 2;

        background-color: $color-light-gray-2;
        padding: 5px 0;
        border-radius: 2px;
        width: 150px;

        .option
            padding: 3px 10px;
            cursor: pointer;
            font-size: 14px;

            &:hover
                background-color: $color-light-gray-3;
                font-weight: bold;

</style>
