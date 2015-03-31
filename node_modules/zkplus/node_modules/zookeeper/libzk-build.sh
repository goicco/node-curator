#!/bin/bash

set -o xtrace

ROOT=`pwd`
BUILD=$ROOT/build/zk
BUILD_TMP=$BUILD/tmp
PLATFORM=`uname`
ZK=zookeeper-3.4.3
ZK_FILE=/$BUILD_TMP/$ZK.tar.gz

ZK_URL=https://download.joyent.com/pub/zookeeper/zookeeper-3.4.3.tar.gz

mkdir -p $BUILD_TMP
if [ ! -e "$ZK_FILE" ] ; then
echo "Downloading $ZK from $ZK_URL"
wget --no-check-certificate $ZK_URL -O $ZK_FILE
if [ $? != 0 ] ; then
    echo "Unable to download zookeeper library"
    exit 1
fi
fi

cd $BUILD_TMP

tar -zxf $ZK_FILE && \
cd $ZK/src/c

if [ "$PLATFORM" != "SunOS" ]; then
    ./configure \
        --without-syncapi \
        --enable-static \
        --disable-shared \
        --with-pic \
        --prefix=$BUILD && \
        make && \
        make install
    if [ $? != 0 ] ; then
            echo "Unable to build zookeeper library"
            exit 1
    fi
    cd $ROOT
    rm -rf $BUILD_TMP
else
    ./configure \
        LIBS="-lnsl -lsocket" \
        CPPFLAGS="-D_POSIX_PTHREAD_SEMANTICS" \
        --prefix=$BUILD && \
        make && \
        make install
    if [ $? != 0 ] ; then
            echo "Unable to build zookeeper library"
            exit 1
    fi
    cd $ROOT
    rm -rf $BUILD_TMP
fi
