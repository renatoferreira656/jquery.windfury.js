#/bin/bash -xe

rm -rf target/pack || true
mkdir -p target/pack 

cp -R src/main/webapp target/pack/windfury
cd target/pack
zip -r windfury.zip windfury
cd -
