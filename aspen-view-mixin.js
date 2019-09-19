/**
 * This mixin is common to all top-level views in the application.
 * @polymerMixin
 * @mixinFunction
 */
const AspenViewMixin = (superclass) => class extends superclass {
  static get properties() {
    return {
      /** An array of objects to be displayed. */
      model: {
        type: Array,
        notify: true,
        value: []
      },

      /** A flag that indicates that the model has been initialized */
      inited: {
        type: Boolean,
        value: false
      }
    }
  }

  /**
  * This method assumes that view contains a firebase-query tag
  * @param model the array model to be updated
  * @param path the path from which to fetch the data.
  */
  updateArrayModel(model, path) {
    if (model.length > 0) {
      model = [];
    }
    var query = this.shadowRoot.querySelector("firebase-query");
    query.path = path;
    console.log("path: " + path);
    query.ref.on("child_added", function (snapshot) {
      model.push(snapshot.val());
      console.log("model");
      console.log(model);
    });
  }

  initArrayModelView(view, query, path) {
    if (!this.inited) {


      query.path = path;
      query.ref.on("child_added", function (snapshot) {
        var val = snapshot.val();
        if (!Array.isArray(val)) {
          view.model.push(val);
        } else {
          for (var currval of val) {
            view.model.push(currval);
          }
        }

        console.log("model");
        console.log(view.model);
        console.log("path: " + path);

      }.bind(this));
      this.inited = true;
    }

  }

  /**
  * This method updates a document-based model that is bound to the view.
  * @param view the view object
  * @param path the path for the query
  */
  updateDocumentModel(model, path) {
    var model = null;

    var query = this.shadowRoot.querySelector("firebase-document");
    query.path = path;
    query.ref.on("child_added", function (snapshot) {
      model = snapshot.val();
      console.log("model");
      console.log(model);
    });
  }

  /**
  * This method is triggered whenever the focus is switched to this view.
  * This method depends on having an iron-ajax instance whose class is "controller"
  */
  initView() {

    var controllers = this.shadowRoot.querySelectorAll(".controller");
    for (let controller of controllers) {
      controller.generateRequest();
    }

  }
}

