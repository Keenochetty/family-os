package expo.modules.workoutactivity

import android.content.Intent
import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoWorkoutActivityModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoWorkoutActivity")

    AsyncFunction("startWorkoutActivity") { state: Map<String, Any?> ->
      val context = appContext.reactContext ?: return@AsyncFunction
      val intent = WorkoutActivityService.createIntent(context, state, WorkoutActivityService.ACTION_START)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        context.startForegroundService(intent)
      } else {
        context.startService(intent)
      }
    }

    AsyncFunction("updateWorkoutActivity") { state: Map<String, Any?> ->
      val context = appContext.reactContext ?: return@AsyncFunction
      val intent = WorkoutActivityService.createIntent(context, state, WorkoutActivityService.ACTION_UPDATE)
      context.startService(intent)
    }

    AsyncFunction("stopWorkoutActivity") {
      val context = appContext.reactContext ?: return@AsyncFunction
      val intent = Intent(context, WorkoutActivityService::class.java).apply {
        action = WorkoutActivityService.ACTION_STOP
      }
      context.startService(intent)
    }
  }
}
