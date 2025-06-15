# Imagem base com PHP + Apache
FROM php:8.1-apache

# Instalar a extensão do MongoDB
RUN pecl install mongodb && docker-php-ext-enable mongodb

# Habilitar mod_rewrite se usar .htaccess
RUN a2enmod rewrite

# Copiar o backend PHP para o container
COPY . /var/www/html/

# Expor a porta padrão do Apache
EXPOSE 80
