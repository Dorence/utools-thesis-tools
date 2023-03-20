module.exports = {
    "application/json": {
        "source": "iana",
        "charset": "UTF-8",
        "compressible": true,
        "extensions": ["json", "map"]
    },
    "application/octet-stream": {
        "source": "iana",
        "compressible": false,
        "extensions": ["bin", "exe"]
    },
    "application/x-www-form-urlencoded": {
        "source": "iana",
        "compressible": true
    },
    "text/html": {
        "source": "iana",
        "compressible": true,
        "extensions": ["html", "htm", "shtml"]
    },
    "text/plain": {
        "source": "iana",
        "compressible": true,
        "extensions": ["txt", "text", "log", "ini"]
    },
};