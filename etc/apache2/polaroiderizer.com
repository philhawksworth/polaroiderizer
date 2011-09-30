<VirtualHost *:80>

    ServerName polaroiderizer.com
    ServerAdmin phawksworth@gmail.com
  
    LogLevel warn
    ErrorLog /var/log/apache2/polaroiderizer.com.error.log
    CustomLog /var/log/apache2/polaroiderizer.com.access.log combined
    LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i \" \"%{Cookie}i\""

    <Directory /var/www/polaroiderizer.com>
        Order deny,allow
        Allow from all
    </Directory>
    
    DocumentRoot /var/www/polaroiderizer.com/
    
</VirtualHost>