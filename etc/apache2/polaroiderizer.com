<VirtualHost *:80>

    ServerName polaroiderzier.com
    ServerAdmin phawksworth@gmail.com
  
    LogLevel warn
    ErrorLog /var/log/apache2/polaroiderzier.com.error.log
    CustomLog /var/log/apache2/polaroiderzier.com.access.log combined
    LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i \" \"%{Cookie}i\""

    <Directory /var/www/polaroiderzier.com>
        Order deny,allow
        Allow from all
    </Directory>
    
    DocumentRoot /var/www/polaroiderzier.com/
    
</VirtualHost>