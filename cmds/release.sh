#/bin/bash -xe

VERSION="$1"

if [ "x$VERSION" == "x" ]; then
    echo "Usage: release.sh VERSION"
    exit 1
fi

git tag "$VERSION"
git push --tags 
