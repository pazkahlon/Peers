export default {
  dir: 'rtl',
  header: 'העבירו קבצים בין מכשירים ללא טרחה',
  sendFiles: 'שליחת קבצים',
  receiveFiles: 'קבלת קבצים',
  connect: 'התחברות',
  makeSure:
    'אנא וודאו שלכם ולמשתמש השני יש חיבור אינטרנט טוב על מנת לאפשר העברה בטוחה ויציבה..',
  allEndToEnd: 'כל ההעברות מוצפנות מקצה לקצה.',
  removeAds: 'הסר פרסומות',
  copyright: 'כל הזכויות שמורות © 2020 Peers.',
  send: {
    dragHere: 'גררו קבצים לכאן',
    orClickUpload: 'או לחצו על כפתור ההעלאה',
    upload: 'העלאה',
    dragToAdd: 'גגרו קבצים שתרצו להוסיף לכאן',
    orClickAdd: 'או לחצו על הכפתור ׳הוספת קבצים׳',
    addMore: 'הוספת קבצים',
    acceptAndContinue: 'אישור',
    removeFile: 'מחק קובץ',
    limit: 'מגבלת העלאה של 20GB',

    stepsHeader: 'הזמינו את המשתמש השני',
    stepOne: 'וודאו שהאתר שלהם פתוח',
    stepTwo: ['בקשו מהם לבחור ', ''],
    stepThree: 'במכשיר של המשתמש השני, הקלידו את הקוד:',
    or: 'או',
    copyLink: 'לחצו כאן על מנת להעתיק קישור',
    whenStepsDone: 'כשכל שלושת הצעדים יושלמו, תתחיל ההעברה.',
  },
  receive: {
    stepsHeader: 'התחברו למשתמש השני',
    stepOne: 'וודאו שהאתר שלהם פתוח',
    stepTwo: ['בקשו מהם לבחור ', ''],
    stepThree: 'הקלידו את הקוד שבמכשיר המשתמש השני',
  },
  progress: {
    progress: 'התקדמות',
    percentReceived: '{percent}% הועברו',
    sizeReceived: '{received} מתוך {total}',
    speed: 'במהירות של {mbPerSecond}mb/s',
    dontClose:
      'וודאו שאתם והמשתמש השני לא סוגרים את הכרטיסיה, אחרת ההתקדמות תיעלם!',

    estimatedTimeRemaining: 'זמן משוער לסיום',
    seconds: 'בערך {seconds} שניות',
    minutes: 'בערך {minutes} דקות',
    hours: 'בערך {hours} שעות',
    hoursMinutes: 'בערך {hours} שעות ו{minutes} דקות',
    calculating: 'מחשב...',
    complete: 'הושלם',

    queue: 'קבצים בהעברה',
    filesReceived: '{received} / {total} קבצים התקבלו',

    cancel: 'ביטול העברה',
    note: 'ביטול ההעברה לא ימחק את הקבצים שכבר התקבלו והורדו אצל המשתמש השני.',
    cancelPrompt:
      'אתם בטוחים שאתם רוצים לבטל את ההעברה?\nקבצים שכבר הורדו לא יימחקו.',
    done: {
      header: 'ההעברה הושלמה!',
      description: 'הרגישו חופשי לרענן או לעזוב את האתר.',
    },
  },
  fileTypes: {
    file: 'קובץ',
    video: 'קובץ וידאו',
  },
  prompts: {
    waitingForPeer: 'ממתין למשתמש השני...',
    pairedAndWaiting: 'חובר בהצלחה, ממתין לחיבור...',
    connectedAndExchanging: 'התחבר בהצלחה. מחליף מפתחות להצפנה מקצה לקצה...',
    gettingFilesMeta: 'משיג מידע על הקבצים...',
    sendingFilesMeta: 'שולח מידע על הקבצים...',
    peerCanceled: 'המשתמש השני ביטל את ההעברה.\nמרענן...',
    peerDisconnected: 'המשתמש השני התנתק.\nמרענן..',
  },
}
