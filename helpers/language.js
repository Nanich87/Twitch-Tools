var lang = (function () {
    return {
        video: {
            notFound: {
                en: 'This video cannot be found!'
            }
        },
        auth: {
            login: {
                success: {
                    en: 'You have successfully logged in.'
                }
            },
            logout: {
                success: {
                    en: 'You have successfully logged out.'
                }
            },
            notAuthorized: {
                en: 'You are not logged in!'
            }
        },
        channel: {
            follow: {
                success: {
                    en: 'You have successfully followed a channel.'
                }
            },
            unfollow: {
                success: {
                    en: 'You have successfully unfollowed a channel.'
                }
            }
        },
        error: {
            channel: {
                name: {
                    en: 'Invalid channel name!'
                },
                url: {
                    en: 'Cannot find url!'
                },
                offline: {
                    en: 'Channel is offline!'
                },
                duplicate: {
                    en: 'This channel has already been added!'
                }
            },
            url: {
                length: {
                    en: 'Invalid url length!'
                }
            },
            download: {
                en: 'This video is not available for download!'
            },
            ajax: {
                en: 'An error occurred while trying to fetch data from the server!'
            }
        }
    };
} ());