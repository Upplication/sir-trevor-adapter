VideoAdapter = {

    handles : [
        'video'
    ],

    // more providers at https://gist.github.com/jeffling/a9629ae28e076785a14f
    providers: {    
        vimeo: {
            regex: /(?:http[s]?:\/\/)?(?:www.)?vimeo.com\/(.*)/,
            html: "<iframe src=\"{{protocol}}//player.vimeo.com/video/{{remote_id}}?title=0&byline=0\" width=\"580\" height=\"320\" frameborder=\"0\"></iframe>"
        },
        youtube: {
            regex: /^.(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&\?]).*/,
            html: "<iframe src=\"{{protocol}}//www.youtube.com/embed/{{remote_id}}\" width=\"580\" height=\"320\" frameborder=\"0\" allowfullscreen></iframe>"
        },
        vine: {
            regex: /(?:http[s]?:\/\/)?(?:www.)?vine.co\/v\/([^\W]*)/,
            html: "<iframe class=\"vine-embed\" src=\"{{protocol}}//vine.co/v/{{remote_id}}/embed/simple\" width=\"{{width}}\" height=\"{{width}}\" frameborder=\"0\"></iframe><script async src=\"http://platform.vine.co/static/scripts/embed.js\" charset=\"utf-8\"></script>",
            square: true
        },
        dailymotion: {
            regex: /(?:http[s]?:\/\/)?(?:www.)?dai(?:.ly|lymotion.com\/video)\/([^\W_]*)/,
            html: "<iframe src=\"{{protocol}}//www.dailymotion.com/embed/video/{{remote_id}}\" width=\"580\" height=\"320\" frameborder=\"0\"></iframe>"
        }
    },

    toHTML: function(data) {

        if (!this.providers.hasOwnProperty(data.source))
            return "";

        var source = this.providers[data.source];

        var protocol = window.location.protocol === "file:" ? 
          "http:" : window.location.protocol;

        return _.template(source.html, {
            protocol: protocol,
            remote_id: data.remote_id
        });
    },

    toJSON: function(html) {
        var matchUrl = /<iframe src="(.*?)"/.exec(html);

        if (!(matchUrl && matchUrl[1]))
            return {};

        var url = matchUrl[1];
        var self = this;
        return Object.keys(this.providers).reduce(function (result, providerKey) {
            if (!_.isEmpty(result))
                return result;

            var provider = self.providers[providerKey];
            var match = provider.exec(url);

            if (match && match[1]) {
                return {
                    source: providerKey,
                    remote_id: match[1]
                }
            } else
                return result;
        }, {});
    },
}

module.exports = VideoAdapter;