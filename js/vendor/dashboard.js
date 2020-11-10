var baseUrl = "http://localhost:3333/";
var likes_array = [];
var comments_array = [];
var postId = null;
var post_array = [];
var profile_data = [];
var id = sessionStorage.getItem("login_id");
var login_uname = sessionStorage.getItem("login_uname");

$(document).ready(() => {
  let modal = document.getElementById("id1");
  let like_modal = document.getElementById("liked-modal");
  let comment_modal = document.getElementById("comment-modal");
  let pic = null;
  let profile_id = null;
  feather.replace();

  $(".nav-link").click(function () {
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
  });

  //--------------------------------session username-----------------------------------
  $("#userName").append(login_uname);
  //--------------------------------profile picture selection-----------------------------------
  $("#edit_profile").click(() => {
    console.log("click");
  });

  //----------------------------------selected pic blur effect-----------------------------------
  var filters = $(".profile_images [data-filter]");
  console.log(filters);

  filters.on("click", function (e) {
    filters.removeClass("img-selected");
    $(this).addClass("img-selected");
    pic = $(this).attr("src");
  });

  //------------------------------store profile in array---------------------------------------------
  $.getJSON(`${baseUrl}profile`, function (data) {
    $.each(data, (k, v) => {
      profile_data.push(v);
      console.log(profile_data);
    });

    //-----------------------get profile pic from stored data------------------------------------------------------------
    $.each(profile_data, (k, v) => {
      if (id == v.userId) {
        pic = v.profilePic;
        $("#userProfile").attr("src", pic);
        profile_id = v.id;
      }
    });
  });
  //-----------------------get all comments and likes for users------------------------------------------------------------
  $.getJSON(`${baseUrl}comments?userId=${id}`, function (data) {
    $("#no_of_comments").html(data.length);
    console.log("data", data, id);
  });

  $.getJSON(`${baseUrl}likes?userId=${id}`, function (data) {
    $("#no_of_likes").html(data.length);
    console.log("data", data, id);
  });

  //-----------------------set profile pic------------------------------------------------------------

  $("#add-profile-pic").click(() => {
    var profile = new Object();
    profile.userId = id;
    profile.profilePic = pic;
    //console.log(profile);
    var input_data = JSON.stringify(profile);
    $.ajax({
      type: "PUT",
      url: `${baseUrl}profile/${profile_id}`,
      data: input_data,
      contentType: "application/json",
      success: function (data) {
        console.log("added succesfully=" + data);
        $("#userProfile").attr("src", pic);
      },
      error: function (err) {
        console.log("error=" + JSON.stringify(err));
      },
    });
  });

  //---------------------------------get Posts--------------------------------------------------------
  function getlikescount(postId) {
    $.getJSON(`${baseUrl}likes?postId=${postId}`, function (data) {
      likes_array.push(data.length);
      //console.log("likes array", likes_array);
      $(`#like${postId}`).append(data.length);
    });
  }
  function getcommentscount(postId) {
    $.getJSON(`${baseUrl}comments?postId=${postId}`, function (data) {
      comments_array.push(data.length);
      console.log("comments array", data);
      $(`#comment${postId}`).append(data.length);

      // });
      //}
    });
  }
  //----------------------------------------------------------------------------------------------

  function getUserPosts() {
    let postTitle = null;
    let category = null;
    let postDate = null;
    let content = null;
    let postUrl = null;

    $.getJSON(`${baseUrl}posts?userId=${id}`, function (data) {
      //console.log("profile succesfully=", data);
      if (data.length != 0) {
        $.each(data, (k, v) => {
          $("#no_of_blogs").html(k);
          console.log(k);
          postTitle = v.postTitle;
          category = v.category;
          postDate = v.postDate;
          content = v.content;
          postId = v.id;
          post_array.push(postId);
          postUrl = v.url;
          userId = v.userId;
          //console.log("post array", post_array);

          $("#user-profile-posts").append(
            ` <div class="container mt-md-5 mb-4 bg-white rounded p-3">
        <div class="row mx-3">
          <img
            id="userProfile"
            src=${postUrl}
            alt=""
            class="img-thumbnail rounded col-md-3 col-lg-2"
          />

          <div class="col-md-9 col-lg-10 pt-2">
            <div class="row">
              <a href=/html/blog.html?id=${postId} class="text-monospace h4 col">${postTitle}</a>
              <span class="text-danger ml-auto col-1 justify-content-end"  onclick=delete_post(${postId})
                ><em data-feather="trash-2"></em
              ></span>
            </div>
            <p class="text-muted m-0">
              Article by
              <a
                id="author"
                href="javascript:goToAuthor()"
                class="text-info"
                >${login_uname}</a
              >
              on <span class="" id="postDate">${postDate}</span> at
              <span class="" id="postTime">20:33</span>
            </p>
            <hr />

            <span id=likeSpan${postId} onclick=wholiked(${postId})>
              <em data-feather="heart"></em>
              <span class="ml-1" id="like${postId}"> </span>&nbsp;&nbsp;</span
            >
            <span id=commentSpan${postId} onclick=whocommented(${postId})>
            <em data-feather="message-circle"></em
            ><span class="ml-1" id="comment${postId}"></span></span>
          </div>
        </div>
      </div>`
          );
          feather.replace();
        });
        // alert("1st");
        function runloop() {
          //   alert("2st");
          $.each(post_array, (k, v) => {
            getlikescount(v);
            getcommentscount(v);
          });
        }
        runloop();

        function displaylikesandcomments() {
          $.each(likes_array, (k, v) => {
            $(`#like${k}`).append(v.length);
          });
          //   alert("3rd");
          $.each(comments_array, (k, v) => {
            $(`#comment${k}`).append(v.length);
          });
        }
        displaylikesandcomments();
      }
    });
  }
  getUserPosts();
});

//---------------------------------get user names who liked--------------------------------------------------------
const wholiked = (postId) => {
  // let liked_user_id = [];
  //data-toggle="modal" data-target="#likeModal"
  let temp_url = null;
  let temp_id = null;
  // let like_modal = document.getElementById("liked-modal");
  document.getElementById("whoLikedData").innerHTML = "";
  console.log("clicked who liked");
  // like_modal.style.display = "flex";
  $(`#likeSpan${postId}`).attr("data-toggle", "modal");
  $(`#likeSpan${postId}`).attr("data-target", "#likeModal");
  //  $(`#likeSpan${postId}`).click()

  $.ajax({
    type: "GET",
    url: `${baseUrl}likes?postId=${postId}`,
    contentType: "application/json",
    success: function (data) {
      console.log("profile succesfully=", data);
      if (data.length != 0) {
        $.each(data, (k, v) => {
          temp_id = v.userId;
          $.each(profile_data, (k1, v1) => {
            if (temp_id == v1.userId) {
              temp_url = v1.profilePic;

              console.log(temp_url);
            }
          });
          //let div = document.createElement("whoLikedData");
          $("#whoLikedData").append(`<div class="col-4 mb-3 text-center">
              <img
                src="${temp_url}"
                alt="user"
                class="col-12 col-md-2 rounded-pill"
                data-filter="img1"
              />
              <h6 class="ml-auto mr-auto">${v.userName}</h6>
            </div>`);
          // like_modal.append(div);
        });
      }
    },
    error: function (err) {
      console.log("error=", err);
    },
  });
};

const whocommented = (postId) => {
  // let comment_modal = document.getElementById("comment-modal");
  document.getElementById("whoCommentedData").innerHTML = "";
  document.getElementById("footerCommentReply").innerHTML = "";
  // console.log("clicked who commented");
  // document.getElementById("comment-modal").style.display = "flex";
  let temp_url = null;
  let temp_id = null;
  $(`#commentSpan${postId}`).attr("data-toggle", "modal");
  $(`#commentSpan${postId}`).attr("data-target", "#commentModal");
  //data-toggle="modal" data-target="#commentModal"
  $.ajax({
    type: "GET",
    url: `${baseUrl}comments?postId=${postId}`,
    contentType: "application/json",
    success: function (data) {
      console.log("profile succesfully=", data);
      if (data.length != 0) {
        $.each(data, (k, v) => {
          temp_id = v.userId;
          $.each(profile_data, (k1, v1) => {
            if (temp_id == v1.userId) {
              temp_url = v1.profilePic;
              console.log(temp_url);
            }
          });
          $("#whoCommentedData").append(`
          <div class="row mb-3">
          <img
            src=${temp_url}
            alt="user"
            class="col-4 col-md-2 rounded-pill h-25"
          />
          <div class="comment col row">
            <div class="col-12 row">
              <a class="text-monospace h5">${v.userName}</a>
              <span class="text-danger ml-auto col-1 justify-content-end" onclick=remove_specific_comment(${v.id})
                ><em data-feather="trash-2"></em
              ></span>
            </div>
            <p class="col-12">
            ${v.comment}
            </p>
          </div>
        </div>
     `);

          //  <img src=${temp_url} class=whocommented_imgs /><span>${v.userName}</span><br><p>${v.comment}</p>
          //  <button id=remove_specific_comment onclick=remove_specific_comment(${v.id})>Remove</button>
        });
        $('#footerCommentReply').append(`
        <form class="form-inline row col-12">
                 <input
                   class="form-control col-9"
                   type="text"
                   placeholder="Reply to comment"
                   aria-label="Reply to comment"
                   id="reply-to-comment"
                 />
                 <button
                   class="btn btn-outline-success col-2 ml-auto"
                   type="submit"
                   onclick=post_comment(${postId})
                 >
                   Reply
                 </button>
               </form>
        `)
        // let div = document.createElement("div");
        // div.innerHTML = `<p>Add comment=<input type=text placeholder=Reply id=reply-to-comment><button type=button onclick=post_comment(${postId})>Post</p>`;
        // comment_modal.append(div);
      }
      else {
      //   let div = document.createElement("div");
      //   div.innerHTML = `<p>Add comment=<input type=text placeholder=Reply id=reply-to-comment><button type=button onclick=post_comment(${postId})>Post</p>`;
      //   comment_modal.append(div);
      $('#footerCommentReply').append(`
        <form class="form-inline row col-12">
                 <input
                   class="form-control col-9"
                   type="text"
                   placeholder="Reply to comment"
                   aria-label="Reply to comment"
                   id="reply-to-comment"
                 />
                 <button
                   class="btn btn-outline-success col-2 ml-auto"
                   type="submit"
                   onclick=post_comment(${postId})
                 >
                   Reply
                 </button>
               </form>
        `)
      }
      feather.replace();
    },
    error: function (err) {
      console.log("error=", err);
    },
  });
};

//------------------------------add post---------------------------------------------------------------------

function post_comment(postId) {
  let reply = document.getElementById("reply-to-comment").value;
  console.log("reply", reply);

  let comm_obj = new Object();
  comm_obj.postId = postId;
  comm_obj.userId = id;
  comm_obj.comment = reply;
  comm_obj.userName = login_uname;
  $.ajax({
    type: "POST",
    url: `${baseUrl}comments`,
    contentType: "application/json",
    data: JSON.stringify(comm_obj),
    success: function (data) {
      console.log("data passed", data);
    },
    error: function (e) {
      console.log("error", e);
    },
  });
  whocommented(postId);
}

function delete_post(postId) {
  console.log("delete call", postId);

  $.confirm({
    title: "Do you want to delete this post",
    content: "Post data will be deleted permenantlly",
    buttons: {
      confirm: function () {
        let like_data = [];
        let comment_data = [];
        $.getJSON(`${baseUrl}comments?postId=${postId}`, function (data) {
          $.each(data, (k, v) => {
            comment_data.push(v);
          });
          console.log(comment_data);
        });

        $.getJSON(`${baseUrl}likes?postId=${postId}`, function (data) {
          $.each(data, (k, v) => {
            like_data.push(v);
          });
          console.log(like_data);
        });
        //--------------------delete comments regarding the post-----------------------------------
        $.each(comment_data, (k, v) => {
          $.ajax({
            type: "DELETE",
            url: `${baseUrl}comments/${v.id}`,
            contentType: "application/json",
            success: function (data) {
              console.log("comments deleted successfully", data);
            },
            error: function (e) {
              console.log("comment delete error", e);
            },
          });
        });
        //--------------------delete likes regarding the post-----------------------------------
        $.each(like_data, (k, v) => {
          $.ajax({
            type: "DELETE",
            url: `${baseUrl}likes/${v.id}`,
            contentType: "application/json",
            success: function (data) {
              console.log("Likes deleted successfully", data);
            },
            error: function (e) {
              console.log(" likes delete error", e);
            },
          });
        });
        //---------------------delete Post----------------------------------------------------
        $.ajax({
          type: "DELETE",
          url: `${baseUrl}posts/${postId}`,
          contentType: "application/json",
          success: function (data) {
            console.log("Post deleted successfully", data);
          },
          error: function (e) {
            console.log("post delete error", e);
          },
        });
        window.location.reload();
      },
      cancel: function () {
        return;
      },
    },
  });
}
function remove_specific_comment(comment_id) {
  $.confirm({
    title: "Do you want to delete this comment",
    content: "The comment will be deleted permenantlly",
    buttons: {
      confirm: function () {
        //--------------------delete comments regarding the post-----------------------------------

        $.ajax({
          type: "DELETE",
          url: `${baseUrl}comments/${comment_id}`,
          contentType: "application/json",
          success: function (data) {
            console.log("comments deleted successfully", data);
          },
          error: function (e) {
            console.log("comment delete error", e);
          },
        });

        window.location.reload();
      },
      cancel: function () {
        return;
      },
    },
  });
}
