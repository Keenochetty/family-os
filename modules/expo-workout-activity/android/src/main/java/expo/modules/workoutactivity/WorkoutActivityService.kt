package expo.modules.workoutactivity

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

class WorkoutActivityService : Service() {
  override fun onBind(intent: Intent?): IBinder? = null

  override fun onCreate() {
    super.onCreate()
    ensureNotificationChannel()
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    when (intent?.action) {
      ACTION_START, ACTION_UPDATE -> {
        val state = intent.extras?.getString(EXTRA_STATE).orEmpty()
        val notification = createNotification(state)
        startForeground(NOTIFICATION_ID, notification)
      }
      ACTION_STOP -> {
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
      }
    }

    return START_STICKY
  }

  private fun ensureNotificationChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return
    }

    val manager = getSystemService(NotificationManager::class.java)
    val channel = NotificationChannel(
      CHANNEL_ID,
      "Active workout",
      NotificationManager.IMPORTANCE_LOW
    ).apply {
      description = "Shows active workout progress and controls."
      setShowBadge(false)
    }

    manager.createNotificationChannel(channel)
  }

  private fun createNotification(state: String): Notification {
    val openIntent = packageManager.getLaunchIntentForPackage(packageName)
    val contentIntent = PendingIntent.getActivity(
      this,
      0,
      openIntent,
      PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
    )

    return NotificationCompat.Builder(this, CHANNEL_ID)
      .setSmallIcon(android.R.drawable.ic_media_play)
      .setContentTitle("Active workout")
      .setContentText(state.ifBlank { "Workout in progress" })
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setContentIntent(contentIntent)
      .setPriority(NotificationCompat.PRIORITY_LOW)
      .build()
  }

  companion object {
    const val ACTION_START = "expo.modules.workoutactivity.START"
    const val ACTION_UPDATE = "expo.modules.workoutactivity.UPDATE"
    const val ACTION_STOP = "expo.modules.workoutactivity.STOP"
    private const val CHANNEL_ID = "active_workout"
    private const val EXTRA_STATE = "state"
    private const val NOTIFICATION_ID = 4061

    fun createIntent(context: Context, state: Map<String, Any?>, actionName: String): Intent {
      return Intent(context, WorkoutActivityService::class.java).apply {
        action = actionName
        putExtra(EXTRA_STATE, formatState(state))
      }
    }

    private fun formatState(state: Map<String, Any?>): String {
      val exercise = state["exerciseName"]?.toString().orEmpty()
      val completedSets = state["completedSets"]?.toString() ?: state["setIndex"]?.toString()
      val totalSets = state["totalSets"]?.toString() ?: state["setTotal"]?.toString()
      val remaining = state["remainingSeconds"]?.toString()

      return listOfNotNull(
        exercise.ifBlank { null },
        if (completedSets != null && totalSets != null) "$completedSets/$totalSets sets" else null,
        remaining?.let { "Rest ${it}s" }
      ).joinToString(" - ").ifBlank { "Workout in progress" }
    }
  }
}
