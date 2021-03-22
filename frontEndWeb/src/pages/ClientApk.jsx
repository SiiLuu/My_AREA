import React from "react";
import app from "../data/app-release.apk";

const ClientApk = () => {
  return (
    <div class="social">
      <div class="social-buttons">
          <a
            class="btn btn-info"
            href={app}
            download="app-release.apk"
            type="application/vnd.android.package-archive"
            role="button"
          >
          <i class="fas fa-cloud-download-alt"></i>
          </a>
      </div>
    </div>
  );
};

export default ClientApk;
