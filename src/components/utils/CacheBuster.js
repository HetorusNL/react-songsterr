import { Component } from "react";
import packageJson from "../../../package.json";

export default class CacheBuster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isLatestVersion: false,
      currentVersion: "0",
      latestVersion: "0",
      refreshCacheAndReload: () => {
        console.log("Clearing cache and hard reloading...");
        if (caches) {
          caches
            .keys()
            .then(async function (names) {
              await Promise.all(names.map((name) => caches.delete(name)));
            })
            .then(
              // delete browser cache and hard reload
              // forceReload=true is deprecated,
              // so do a 'normal' reload since we've already cleared the cache
              window.location.reload()
            );
        }
      },
    };
  }

  semverGreaterThan = (versionA, versionB) => {
    const versionsA = versionA.split(/\./g);
    const versionsB = versionB.split(/\./g);
    while (versionsA.length || versionsB.length) {
      const a = Number(versionsA.shift());
      const b = Number(versionsB.shift());
      if (a === b) continue;
      return a > b || isNaN(b);
    }
    return false;
  };

  componentDidMount() {
    fetch("/meta.json")
      .then((response) => response.json())
      .then((meta) => {
        const latestVersion = meta.version;
        const currentVersion = packageJson.version;
        console.log(meta, packageJson);

        const shouldForceRefresh = this.semverGreaterThan(
          latestVersion,
          currentVersion
        );
        if (shouldForceRefresh) {
          console.log(
            `new version: ${latestVersion} available, should force refresh`
          );
          this.setState({
            loading: false,
            isLatestVersion: false,
            latestVersion: latestVersion,
            currentVersion: currentVersion,
          });
        } else {
          console.log(
            `running latest version: ${latestVersion}, no refresh needed`
          );
          this.setState({ loading: false, isLatestVersion: true });
        }
      });
  }

  render() {
    const {
      loading,
      isLatestVersion,
      currentVersion,
      latestVersion,
      refreshCacheAndReload,
    } = this.state;
    return this.props.children({
      loading,
      isLatestVersion,
      currentVersion,
      latestVersion,
      refreshCacheAndReload,
    });
  }
}

/*
 * source:
 * https://dev.to/flexdinesh/cache-busting-a-react-app-22lk
 */
