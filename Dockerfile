# استفاده از یک تصویر پایه اوبونتو 24.04 (نزدیک به 25.04 شما و پایدارتر)
FROM ubuntu:24.04

# برای اینکه دستورات بدون پرسش اجرا بشن
ENV DEBIAN_FRONTEND=noninteractive

# آپدیت سیستم و نصب پیش‌نیازها
RUN apt-get update && apt-get install -y \
  curl \
  git \
  wget \
  gnupg \
  unzip \
  openjdk-17-jdk \
  && rm -rf /var/lib/apt/lists/*

# نصب Node.js (پیشنهاد میشه از nvm برای مدیریت ورژن استفاده کنید، ولی برای سادگی اینجا مستقیم نصب می‌کنیم)
# Node.js 20 LTS برای React 19 مناسبه.
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
  apt-get install -y nodejs && \
  npm install -g npm@latest

# نصب Expo CLI و watchman
RUN npm install -g expo-cli watchman

# تنظیم متغیرهای محیطی برای Android SDK
# SDK رو داخل کانتینر نصب می‌کنیم، چون Realm بهش نیاز داره برای بیلد کردن native modules
ENV ANDROID_HOME=/opt/android/sdk
ENV PATH="$PATH:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools"

# ساخت دایرکتوری‌های لازم برای SDK
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools

# دانلود Command Line Tools
WORKDIR /tmp
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O cmdline-tools.zip && \
  unzip cmdline-tools.zip -d ${ANDROID_HOME}/cmdline-tools/latest && \
  rm cmdline-tools.zip

# پذیرش لایسنس‌ها و نصب Platform-Tools و Build-Tools
# Realm برای کامپایل به build-tools و platform-tools نیاز داره.
# ورژن 34.0.0 از build-tools با Android 14 (API 34) سازگاره که با Expo 53 همخوانی داره.
RUN yes | sdkmanager --licenses && \
  sdkmanager "platform-tools" "build-tools;34.0.0" "platforms;android-34"

# تعریف دایرکتوری کاری پروژه
WORKDIR /app

# کپی کردن فایل‌های package.json و app.json (برای استفاده از کش NPM)
COPY package.json ./
COPY app.json ./

# نصب وابستگی‌های پروژه
# از `npm ci` استفاده میشه که سرعت بالاتری داره و بر اساس package-lock.json نصب می‌کنه
RUN npm ci

# در نهایت، کپی کردن بقیه فایل‌های پروژه
# این مرحله باید بعد از npm ci باشه تا اگر تغییری در کد اصلی پروژه دادید، کش npm خراب نشه.
COPY . .

# پورتی که Expo dev server استفاده می‌کنه
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001

# دستور پیش‌فرض برای اجرای پروژه
CMD ["expo", "start", "--no-hmr", "--tunnel"]