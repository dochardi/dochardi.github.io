var interval = "https://clipmanager.net/interval/";

$("#menu-toggle").click(function(e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});
$(document).ready(function() {
    $ClipManager.start();

});
var $ClipManager = {
    start: function () {
        $ClipManager.Listener();
    },
    Listener: function () {
        $("[data-url]").click(function () {
            var pageName = $(this).attr('data-url');
            if (pageName.length > 0) {
                $ClipManager.pagemanagement(pageName);
            }
        });
         $("[data-session]").click(function () {
            var guildid = $(this).attr('data-session');
            if (guildid.length > 0) {
                $ClipManager.loadGuildSession(guildid);
            }
        });
    },
    pagemanagement: function (page) {
        $.ajax({
            type: "POST",
            url: interval,
            data: `function=pagemanagement&page=${page}`,
            success: function(result)
            {	
                console.log(`Page ${page} is loading...`);
                $('#root').html(result);
            },
            error: function(result) { console.log('[ClipManager][Error] Something has gone wrong at the moment, try again later. [Pagemanagement]'); }
        });
    },
    loadGuildSession: function (guildid) {
        $.ajax({
            type: "POST",
            url: interval,
            data: `function=loadguildsession&id=${guildid}`,
            success: function(result)
            {
              var obj = JSON.parse(result);
              
              if (obj.code === '200') {
                setTimeout(function(){
                  window.location.reload(1);
               }, 2000);
                //window.location.reload();
                
                console.log(`Loading guild ${guildid}...`);
                notify('success', 'Success', obj.message);
              } else if (obj.code === '401') {
                notify('error', '', obj.message);
                //alertify.error(obj.message);
              }
              
            },
            error: function(result) { console.log('[ClipManager][Error] Something has gone wrong at the moment, try again later. [loadGuildSession]'); }
        });
    },
    userLogout: function () {
        $.ajax({
            type: "POST",
            url: interval,
            data: `function=userlogout`,
            success: function(result)
            {
              
              var obj = JSON.parse(result);
              if (obj.code === '200') {
                window.location.reload();
                
                console.log(`Loading guild ${guildid}...`)
                notify('success', 'Success', obj.message);
              } else if (obj.code === '400') {
                notify('warning', 'Warning', obj.message);
              }
              
            },
            error: function(result) { console.log('[ClipManager][Error] Something has gone wrong at the moment, try again later. [userLogout]'); }
        });
    },
    clipsDelete: function (uuid,id) {
      var $table = $('#table');

        $.ajax({
            type: "POST",
            url: interval,
            data: `function=clips&type=delete&uuid=`+uuid,
            success: function(result)
            {
              console.log(result);
              var obj = JSON.parse(result);
              if (obj.code === '200') {
                $table.bootstrapTable('removeByUniqueId', id);
                notify('success', 'Success', obj.message);
              } else if (obj.code === '403') {
                notify('warning', 'Warning', obj.message);
              }
              
            },
            error: function(result) { console.log('[ClipManager][Error] Something has gone wrong at the moment, try again later. [userLogout]' + result); }
        });
    },
    saveSettings: function () {
      var json_language = JSON.stringify({language: $('select[name=language]').val()});
      var json_channel = JSON.stringify({channel: $('select[name=clipchannel]').val()});
      var json_twitch   = JSON.stringify({status: $("input:radio[name=streamer]:checked").val(), allow: $("#streamer_allow").tagsinput('items'), deny: $("#streamer_deny").tagsinput('items')});
      var json_vote = JSON.stringify({vote: $('input:radio[name=vote]:checked').val()});
      var json_topic = JSON.stringify({status: $('select[name=topic]').val(),message: $("#topic_msg").val()});
      var json_message = JSON.stringify({status: $('select[name=message]').val(),message: $("#message_msg").val()});

        $.ajax({
            type: "POST",
            url: interval,
            data: `function=settings&type=save&json_language=${json_language}&json_channel=${json_channel}&json_twitch=${json_twitch}&json_vote=${json_vote}&json_topic=${json_topic}&json_message=${json_message}`,
            success: function(result)
            {
              
              var obj = JSON.parse(result);
              if (obj.code === '200') {
                notify('success', 'Success', obj.message);
              } else if (obj.code === '403') {
                notify('warning', 'Warning', obj.message);
              }
              
            },
            error: function(result) { console.log('[ClipManager][Error] Something has gone wrong at the moment, try again later. [userLogout]' + result); }
        });
    },
    staffMemberCreateModal: function (title) {
        $("#exampleModal").modal("toggle");
        document.getElementById("custommodaltitle").innerHTML = title;
        document.getElementById("custommodalbody").innerHTML = '<center>Loading . . . </center> ';
        $.ajax({
            type: "POST",
            url: interval,
            data: `function=staffmember&type=modal`,
            success: function(result)
            {
              
              var obj = JSON.parse(result);
              if (obj.code === '200') {
                document.getElementById("custommodalbody").innerHTML = obj.message;
                $(".pluginselect").selectpicker({width:"100%",styleBase:"bootselect-custom"});
              } else if (obj.code === '403') {
                notify('warning', 'Warning', obj.message);
              }
              
            },
            error: function(result) { console.log('[ClipManager][Error] Something has gone wrong at the moment, try again later. [staffMemberCreateModal]' + result); }
        });
    },
    staffMemberCreate: function () {
        var userid = $('#staffmemberid').val();
        var role = $('select[name=role]').val();
        $.ajax({
            type: "POST",
            url: interval,
            data: `function=staffmember&type=add&staffid=${userid}&role=${role}`,
            success: function(result)
            {
              
              var obj = JSON.parse(result);
              if (obj.code === '200') {
                $ClipManager.pagemanagement('staffaccess');
                document.getElementById("pushdata").innerHTML = obj.message;
              } else if (obj.code === '403') {
                document.getElementById("pushdata").innerHTML = obj.message;
              }
              
            },
            error: function(result) { console.log('[ClipManager][Error] Something has gone wrong at the moment, try again later. [staffMemberCreate]' + result); }
        });
    },
    staffMemberDelete: function (userid) {
        $.ajax({
            type: "POST",
            url: interval,
            data: `function=staffmember&type=remove&staffid=${userid}`,
            success: function(result)
            {
              
              var obj = JSON.parse(result);
              if (obj.code === '200') {
                notify('success', 'Success', obj.message);
                $ClipManager.pagemanagement('staffaccess');
              } else if (obj.code === '403') {
                notify('warning', 'Warning', obj.message);
              }
              
            },
            error: function(result) { console.log('[ClipManager][Error] Something has gone wrong at the moment, try again later. [staffMemberCreate]' + result); }
        });
    },
    AutoClipCreateModal: function (title) {
      $("#exampleModal").modal("toggle");
      document.getElementById("custommodaltitle").innerHTML = title;
      document.getElementById("custommodalbody").innerHTML = '<center>Loading . . . </center> ';
      $.ajax({
          type: "POST",
          url: interval,
          data: `function=autoclip&type=modal`,
          success: function(result)
          {
            console.log(result);
            var obj = JSON.parse(result);
            if (obj.code === '200') {
              document.getElementById("custommodalbody").innerHTML = obj.message;
              $(".pluginselect").selectpicker({width:"100%",styleBase:"bootselect-custom"});
            } else if (obj.code === '403') {
              notify('warning', 'Warning', obj.message);
            }
            
          },
          error: function(result) { console.log('[ClipManager][Error] Something has gone wrong at the moment, try again later. [staffMemberCreateModal]' + result); }
      });
    },
    AutoClipCreateEditModal: function (uniqid,title) {

      $("#exampleModal").modal("toggle");
      document.getElementById("custommodaltitle").innerHTML = title;
      document.getElementById("custommodalbody").innerHTML = '<center>Loading . . . </center> ';
      $.ajax({
          type: "POST",
          url: interval,
          data: `function=autoclip&type=modal_edit&uniqid=`+uniqid,
          success: function(result)
          {
            console.log(result);
            var obj = JSON.parse(result);
            if (obj.code === '200') {
              document.getElementById("custommodalbody").innerHTML = obj.message;
              $(".pluginselect").selectpicker({width:"100%",styleBase:"bootselect-custom"});
            } else if (obj.code === '403') {
              notify('warning', 'Warning', obj.message);
            }
            
          },
          error: function(result) { console.log('[ClipManager][Error] Something has gone wrong at the moment, try again later. [staffMemberCreateModal]' + result); }
      });
    },
    AutoClipCreateStreamer: function () {
      var streamer = $('#twitchusername').val();
      var channel = $('select[name=channel]').val();
      var saveclip = $('select[name=saveclip]').val();
      var voting = $('select[name=voting]').val();
      var message = $('#message').val();

    //   console.log(message);
      $.ajax({
          type: "POST",
          url: interval,
          data: `function=autoclip&type=add&streamer=${encodeURIComponent(streamer)}&channel=${channel}&saveclip=${saveclip}&message=${encodeURIComponent(message)}&voting=${voting}`,
          success: function(result)
          {
            
            var obj = JSON.parse(result);
            if (obj.code === '200') {
              $ClipManager.pagemanagement('autoclip');
              document.getElementById("pushdata").innerHTML = obj.message;
            } else if (obj.code === '403') {
              document.getElementById("pushdata").innerHTML = obj.message;
            }
            
          },
          error: function(result) { console.log('[ClipManager][Error] Something has gone wrong at the moment, try again later. [staffMemberCreate]' + result); }
      });
    },
        AutoClipCreateEditStreamer: function (uniqid) {
      var streamer = $('#twitchusername').val();
      var channel = $('select[name=channel]').val();
      var saveclip = $('select[name=saveclip]').val();
      var voting = $('select[name=voting]').val();
      var message = $('#message').val();

    //   console.log(message);
      $.ajax({
          type: "POST",
          url: interval,
          data: `function=autoclip&type=edit&streamer=${encodeURIComponent(streamer)}&channel=${channel}&saveclip=${saveclip}&message=${encodeURIComponent(message)}&voting=${voting}&uniqid=${uniqid}`,
          success: function(result)
          {
            console.log(result);
            var obj = JSON.parse(result);
            if (obj.code === '200') {
              $ClipManager.pagemanagement('autoclip');
              document.getElementById("pushdata").innerHTML = obj.message;
            } else if (obj.code === '403') {
              document.getElementById("pushdata").innerHTML = obj.message;
            }
            
          },
          error: function(result) { console.log('[ClipManager][Error] Something has gone wrong at the moment, try again later. [staffMemberCreate]' + result); }
      });
    },
    AutoClipDeleteStreamer: function (uniqid) {
      $.ajax({
          type: "POST",
          url: interval,
          data: `function=autoclip&type=remove&uniqid=${uniqid}`,
          success: function(result)
          {
            console.log(result);
            var obj = JSON.parse(result);
            if (obj.code === '200') {
              // notify('success', 'Success', obj.message);
              $ClipManager.pagemanagement('autoclip');
              notify('success', 'Success', obj.message);

            } else if (obj.code === '403') {
              notify('warning', 'Warning', obj.message);
            }
            
          },
          error: function(result) { console.log('[ClipManager][Error] Something has gone wrong at the moment, try again later. [staffMemberCreate]' + result); }
      });
  },
    openClipModal: function (clipurl) {
        $("#loadvideo").modal("toggle");
        document.getElementById("videoframe").setAttribute("src", clipurl);
       
    },
    closeClipModal: function () {
        $("#loadvideo").modal("toggle");
        document.getElementById("videoframe").pause();
    },
};
window.document.onkeydown = function(e) {
  if (!e) {
    e = event;
  }
  if (e.keyCode == 27) {
    $ClipManager.closeClipModal();
  }
}