/*eslint-env browser*/
/*eslint "no-console": "off" */
/*global $ */

var data_url = ""

var tableApp = new Vue({
    el: "#tableData",
    data: {
        search: '',
        members: [],
        selected: "disabled",
        options: [],
        checkedParties: [],
        selectedStatesArray: [],
        states_list: {},
        headers: [{
                text: 'Name',
                value: 'last_name'
            },
            {
                text: 'Party',
                value: 'party'
            },
            {
                text: 'State',
                value: 'state'
                  },
            {
                text: 'Years in Office',
                value: 'seniority'
                  },
            {
                text: '% Votes with Party',
                value: 'votes_with_party_pct'
            }
                 ]
    },

    methods: {
        addToArray: function () {
            if (!this.selectedStatesArray.includes(this.selected)) {
                this.selectedStatesArray.push(this.selected)
            }
            this.selected = "disabled"
        },
        removeFromArray: function (event) {
            this.selectedStatesArray.splice(this.selectedStatesArray.indexOf(event.target.parentElement.getAttribute('value')), 1)

        },
        
        showBox: function() {
           $('a.iframe').colorbox({
                    iframe: true,
                    width: "60%",
                    height: "60%"
                })
      }
    },
    
    computed: {
        filteredMembers: function () {
            function statesAndParties(member) {
                if ((tableApp.selectedStatesArray.includes(member.state)  || tableApp.selectedStatesArray.length === 0) && (tableApp.checkedParties.includes(member.party) || tableApp.checkedParties.length === 0)) {
                    return member
                }
            }
            
            return this.members.filter(statesAndParties)
        }
    },

    updated: function () {
        this.$nextTick(function () {
            $('a.iframe').colorbox({
                iframe: true,
                width: "60%",
                height: "60%"
            })
        })
        if ($('tbody > tr').length > 1) {
            $('#loader').fadeOut()
        }
    }

})


$.getJSON(states_json_url, function (data) {
    tableApp.states_list = data;
})

if ($("#senate").length) {
    data_url = senate_url;
} else if ($("#house").length) {
    data_url = house_url;
}

$(document).ready(function () {
    var control_array = []
    $.getJSON(data_url, function (data) {
        data.results[0].members.map(function (member) {
            tableApp.members.push(member);
            if (!control_array.includes(member.state)) {
                control_array.push(member.state)
            }
        })
        control_array.sort().forEach(function (state) {
            tableApp.options.push({
                text: tableApp.states_list[state],
                value: state
            })
        })
    })
})

