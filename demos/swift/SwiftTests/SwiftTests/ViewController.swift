import UIKit

class ViewController: UIViewController {
  lazy var detailView: DetailView = {
    let v = DetailView()
    v.data = Context.GLOBAL.create(type: Test.self) as! Test
    return v
  }()
  override func viewDidLoad() {
    super.viewDidLoad()
    detailView.initAllViews()
    let views: [String:UIView] = ["v": detailView.view]
    for (_, v) in views {
      v.translatesAutoresizingMaskIntoConstraints = false
      view.addSubview(v)
    }
    view.addConstraints(NSLayoutConstraint.constraints(
      withVisualFormat: "V:|-[v]-|",
      options: NSLayoutFormatOptions.init(rawValue: 0),
      metrics: nil,
      views: views))
    view.addConstraints(NSLayoutConstraint.constraints(
      withVisualFormat: "H:|-[v]-|",
      options: NSLayoutFormatOptions.init(rawValue: 0),
      metrics: nil,
      views: views))
  }
}
