var filesToBeMoved = [{
    src: 'required_files/QRScanner.swift',
    dst: 'platforms/ios/SuperTeacher/Plugins/cordova-plugin-qrscanner/QRScanner.swift'
}]
module.exports = function (context) {
    var fs = require('fs')
    for (let index = 0; index < filesToBeMoved.length; index++) {
        const element = filesToBeMoved[index]
        let srcFile = context.opts.projectRoot + '/' + element.src
        let dstFile = context.opts.projectRoot + '/' + element.dst
        if (fs.existsSync(srcFile)) {
            if (fs.existsSync(dstFile)) {
                fs.unlinkSync(dstFile)
            }
            fs.copyFileSync(srcFile, dstFile)
            // console.log('\nFile copied from ' + srcFile + ' to ' + dstFile)
        }
    }
}
