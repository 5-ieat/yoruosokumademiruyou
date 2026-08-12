import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    // 現在の許可向き（デフォルトは全向き許可）
    var orientationLock: UIInterfaceOrientationMask = .all

    func application(_ application: UIApplication,
                     supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
        return orientationLock
    }

    // シンプルなヘルパー
    func lockOrientation(_ mask: UIInterfaceOrientationMask) {
        orientationLock = mask
    }

    // MARK: UISceneSession Lifecycle
    func application(_ application: UIApplication,
                     configurationForConnecting connectingSceneSession: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }
}
