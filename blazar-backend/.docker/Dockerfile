FROM php:8.4-fpm-alpine

# Install system dependencies
RUN apk update && apk add --no-cache \
    bash \
    nano \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    wget \
    autoconf \
    g++ \
    make \
    linux-headers \
    curl-dev \
    openssl-dev \
    pkgconf \
    libzip-dev

# Install Composer
RUN wget https://getcomposer.org/installer -O composer-installer.php \
    && php composer-installer.php --install-dir=/usr/local/bin --filename=composer \
    && rm composer-installer.php

# Install Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash
RUN  mv ~/.symfony5/bin/symfony /usr/local/bin/sf

# Install and configure Xdebug
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# Install MongoDB extension
RUN pecl install mongodb \
    && docker-php-ext-enable mongodb

# Install PHP extensions
RUN docker-php-ext-install zip