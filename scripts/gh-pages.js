var ghpages = require('gh-pages');

ghpages.publish(
    'build',
    {
        branch: 'gh-pages',
        silent: true,
        repo: 'https://' + process.env.GITHUB_TOKEN + '@github.com/ashwin003/hello-svelte.git',
        user: {
            name: 'Ashwin Thyagarajan',
            email: 'ashwin031192@gmail.com'
        },
        dotfiles: true
    },
    () => {
        console.log('Deploy Complete!')
    }
)