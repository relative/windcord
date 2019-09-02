# windcord
Patch Discord for iOS's JavaScript bundles to make modifications  
**This project is in a VERY early state. Do not expect any support.**  
Your device **must** be jailbroken.

## Usage
1. Configure .env with information for your device
2. Use Filza to determine the path for your Discord.app (important!). This may be different on every device.
3. Run `yarn pull` to pull the main.jsbundle and manifest.json
4. Run `yarn debundle` to debundle the jsbundle and output to the `out/` directory
5. Make your changes
6. Run `yarn rebundle` to rebundle the modified source and output to the `dist/` directory
7. Run `yarn push` to push your updated jsbundle to the device
8. Kill Discord in the app switcher
9. Launch and see your modifications

## Next steps with the project
* patch IPA/bundle updater to change domain from dl.discordapp.net to a host to serve patched bundles/manifests