# Use multi-stage build to optimize image size

# Stage 1: Build environment
FROM ubuntu:24.04 AS build

# Set environment variables to avoid user interaction during installs
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Etc/UTC
ENV ANDROID_SDK_ROOT=/opt/android-sdk

# Update and install core dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  curl \
  wget \
  unzip \
  git \
  ca-certificates \
  build-essential \
  openjdk-17-jdk-headless \
  gradle \
  nodejs \
  npm \
  && rm -rf /var/lib/apt/lists/*

# Install Node.js 20 (official NodeSource PPA)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y nodejs \
  && npm install -g npm@latest

# Install Expo CLI globally
RUN npm install -g expo-cli

# Install Android SDK Command-line Tools and platform tools
RUN mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools \
  && cd /opt \
  && wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O cmdline-tools.zip \
  && unzip cmdline-tools.zip -d ${ANDROID_SDK_ROOT}/cmdline-tools \
  && mv ${ANDROID_SDK_ROOT}/cmdline-tools/cmdline-tools ${ANDROID_SDK_ROOT}/cmdline-tools/latest \
  && rm cmdline-tools.zip

# Add Android SDK tools to PATH
ENV PATH="${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools:${PATH}"

# Accept Android licenses
RUN yes | sdkmanager --licenses

# Install required Android SDK components: platform-tools, build-tools, platforms
RUN sdkmanager "platform-tools" "build-tools;33.0.2" "platforms;android-33"

# Set working directory
WORKDIR /app

# Expose ports commonly used by Expo (19000,19001,19002)
EXPOSE 19000 19001 19002

# Volume for node_modules and Android SDK caching
VOLUME ["/app/node_modules", "/root/.android"]

# Default command - open a shell
CMD ["bash"]