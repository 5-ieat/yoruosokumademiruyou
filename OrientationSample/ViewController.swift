import UIKit

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        title = "向き操作サンプル"

        let stack = UIStackView()
        stack.axis = .vertical
        stack.spacing = 12
        stack.alignment = .center
        stack.translatesAutoresizingMaskIntoConstraints = false

        let btnPortrait = makeButton("縦向きにロック") { [weak self] in
            self?.setOrientationLock(.portrait, forceTo: .portrait)
        }
        let btnPortraitDown = makeButton("下向きに変更（portrait-down）") { [weak self] in
            self?.setOrientationLock(.portrait, forceTo: .portraitUpsideDown)
        }
        let btnLandscapeLeft = makeButton("左向きにロック") { [weak self] in
            self?.setOrientationLock(.landscapeLeft, forceTo: .landscapeLeft)
        }
        let btnUnlock = makeButton("ロック解除（自動回転に戻す）") { [weak self] in
            self?.setOrientationLock(.all, forceTo: nil)
        }

        [btnPortrait, btnPortraitDown, btnLandscapeLeft, btnUnlock].forEach {
            stack.addArrangedSubview($0)
        }

        view.addSubview(stack)
        NSLayoutConstraint.activate([
            stack.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            stack.centerYAnchor.constraint(equalTo: view.centerYAnchor),
        ])
    }

    private func makeButton(_ title: String, action: @escaping ()->Void) -> UIButton {
        let b = UIButton(type: .system)
        b.setTitle(title, for: .normal)
        b.titleLabel?.font = .systemFont(ofSize: 16)
        b.backgroundColor = .secondarySystemBackground
        b.layer.cornerRadius = 8
        b.contentEdgeInsets = UIEdgeInsets(top: 10, left: 14, bottom: 10, right: 14)
        b.translatesAutoresizingMaskIntoConstraints = false
        b.widthAnchor.constraint(equalToConstant: 300).isActive = true
        b.addAction(UIAction { _ in action() }, for: .touchUpInside)
        return b
    }

    // mask: Appが許可する向き、forceTo: 実際に強制したい向き（nilなら回転強制なし）
    private func setOrientationLock(_ mask: UIInterfaceOrientationMask, forceTo forced: UIInterfaceOrientation?) {
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return }
        appDelegate.lockOrientation(mask)

        if let forced = forced {
            // 強制的にデバイス向きを書き換えて回転を試みる
            UIDevice.current.setValue(forced.rawValue, forKey: "orientation")
            UIViewController.attemptRotationToDeviceOrientation()
        } else {
            UIViewController.attemptRotationToDeviceOrientation()
        }
    }
}
