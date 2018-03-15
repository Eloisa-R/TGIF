/*eslint-env browser*/
/*eslint "no-console": "off" */
/*global $ */

var data_url = ""

var tablesApp = new Vue({
    el: "#tableLoyalty",
    data: {
        headers_main: [
            {
                text: 'Party',
                value: 'party_name'
            },
            {
                text: 'No. of Party Votes',
                value: 'total_votes'
            },
            {
                text: '% Voted with Party',
                value: 'votes_with_party_pct'
            }
        ],
        members: [],
        count: [
            {
                party: "D",
                party_name: "Democrats",
                number_reps: 0,
                total_votes_with_party: 0,
                pct_votes_with_party: 0
            },
            {
                party: "R",
                party_name: "Republicans",
                number_reps: 0,
                total_votes_with_party: 0,
                pct_votes_with_party: 0,
            },
            {
                party: "I",
                party_name: "Independents",
                number_reps: 0,
                total_votes_with_party: 0,
                pct_votes_with_party: 0,
            },
            {
                party: "All",
                party_name: "Total",
                number_reps: 0,
                total_votes_with_party: 0,
                pct_votes_with_party: 0,
            }
        ],
        headers_tables: [
            {
                text: 'Name',
                value: 'last_name'
            },
            {
                text: 'No. of Party Votes',
                value: 'total_votes'
            },
            {
                text: '% Voted with Party',
                value: 'votes_with_party_pct'
            }
        ],
        membersMoreVoted: [],
        memberLeastVoted: [],
        membersMoreLimited: [],
        membersLeastLimited: []
    },

    created: function () {
        if ($("#senate").length) {
            data_url = senate_url;
        } else if ($("#house").length) {
            data_url = house_url;
        }


        $.getJSON(data_url, function (data) {
            data.results[0].members.map(function (member) {
                tablesApp.members.push(member);
            })
            fillCount(tablesApp.members, tablesApp.count);
            tablesApp.membersMoreVoted = getMembersMoreVoted(tablesApp.members);
            tablesApp.memberLeastVoted = getMembersLeastVoted(tablesApp.members);
            tablesApp.membersMoreLimited = getMembersMoreLimit(tablesApp.members, tablesApp.membersMoreVoted);
            tablesApp.membersLeastLimited = getMembersLeastLimit(tablesApp.members, tablesApp.memberLeastVoted)

        })

        function fillCount(members_array, count_array) {
            members_array.forEach(function (element) {
                count_array.forEach(function (datapoint) {
                    if (element.party == datapoint.party) {
                        datapoint.number_reps += 1;
                        datapoint.total_votes_with_party += parseFloat(element.votes_with_party_pct)
                        datapoint.pct_votes_with_party = datapoint.total_votes_with_party / datapoint.number_reps
                    }
                })
                count_array[3].number_reps += 1;
                count_array[3].total_votes_with_party += parseFloat(element.votes_with_party_pct)
                count_array[3].pct_votes_with_party = count_array[3].total_votes_with_party / count_array[3].number_reps
            })
            return count_array;
        }

        function getMembersMoreVoted(members_array) {
            var array_to_sort = members_array.slice()

            function compareDesc(a, b) {
                if (parseFloat(a.votes_with_party_pct) > parseFloat(b.votes_with_party_pct)) {
                    return -1;
                } else if (parseFloat(a.votes_with_party_pct) < parseFloat(b.votes_with_party_pct)) {
                    return 1;
                } else if (parseFloat(a.votes_with_party_pct) === parseFloat(b.votes_with_party_pct)) {
                    return 0;
                }
            }
            return array_to_sort.sort(compareDesc)
        }

        function getMembersLeastVoted(members_array) {
            var array_to_sort = members_array.slice()

            function compareAsc(a, b) {
                if (parseFloat(a.votes_with_party_pct) < parseFloat(b.votes_with_party_pct)) {
                    return -1;
                } else if (parseFloat(a.votes_with_party_pct) > parseFloat(b.votes_with_party_pct)) {
                    return 1;
                } else if (parseFloat(a.votes_with_party_pct) === parseFloat(b.votes_with_party_pct)) {
                    return 0;
                }
            }
            return array_to_sort.sort(compareAsc);
        }

        function getMembersMoreLimit(members_array, array_more_or_less_members) {
            var array_to_limit = array_more_or_less_members.slice()
            var ten_percent = Math.round(members_array.length / 10)
            var value_limit = array_to_limit[ten_percent + 1].votes_with_party_pct

            function returnLimitValues(value) {
                return parseFloat(value.votes_with_party_pct) >= parseFloat(value_limit);
            }
            return array_to_limit.filter(returnLimitValues)
        }

        function getMembersLeastLimit(members_array, array_more_or_less_members) {
            var array_to_limit = array_more_or_less_members.slice()
            var ten_percent = Math.round(members_array.length / 10)
            var value_limit = array_to_limit[ten_percent + 1].votes_with_party_pct

            function returnLimitValues(value) {
                return parseFloat(value.votes_with_party_pct) <= parseFloat(value_limit);
            }
            return array_to_limit.filter(returnLimitValues)
        }


    },
    
    methods: {
      showBox: function() {
           $('a.iframe').colorbox({
                    iframe: true,
                    width: "60%",
                    height: "60%"
                })
      }
    },

    updated: function () {
        this.$nextTick(function () {
            $('a.iframe').colorbox({
                iframe: true,
                width: "60%",
                height: "60%"
            })
            if ($('tbody > tr').length) {
                $('#loader').fadeOut()
            }
        })
    },
})

/*On countPols, to access "count" I have to use the name of the app because otheriwse "this" is bound to the forEach function and it's undefined*/
